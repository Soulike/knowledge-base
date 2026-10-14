const versionPattern =
  /^(?<year>\d{4})\.(?<month>[1-9]\d*)\.(?<day>[1-9]\d*)-(?<sequence>[1-9]\d*)$/u;
const datePattern = /^(?<year>\d{4})\.(?<month>[1-9]\d*)\.(?<day>[1-9]\d*)$/u;

export interface PluginVersion {
  date: string;
  sequence: number;
}

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

function parseInteger(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

function parseCalendarDate(value: string): CalendarDate | undefined {
  const match = datePattern.exec(value);
  const year = parseInteger(match?.groups?.year);
  const month = parseInteger(match?.groups?.month);
  const day = parseInteger(match?.groups?.day);

  if (year === undefined || month === undefined || day === undefined) {
    return undefined;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }

  return { year, month, day };
}

function compareCalendarDates(left: string, right: string): number {
  const parsedLeft = parseCalendarDate(left);
  const parsedRight = parseCalendarDate(right);

  if (parsedLeft === undefined || parsedRight === undefined) {
    throw new Error(
      `Cannot compare invalid release dates '${left}' and '${right}'.`,
    );
  }

  const leftValue = Date.UTC(
    parsedLeft.year,
    parsedLeft.month - 1,
    parsedLeft.day,
  );
  const rightValue = Date.UTC(
    parsedRight.year,
    parsedRight.month - 1,
    parsedRight.day,
  );
  return Math.sign(leftValue - rightValue);
}

export function parsePluginVersion(value: string): PluginVersion | undefined {
  const match = versionPattern.exec(value);
  const year = match?.groups?.year;
  const month = match?.groups?.month;
  const day = match?.groups?.day;
  const sequence = parseInteger(match?.groups?.sequence);

  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    sequence === undefined
  ) {
    return undefined;
  }

  const date = `${year}.${month}.${day}`;
  return parseCalendarDate(date) === undefined ? undefined : { date, sequence };
}

export function releaseDateForTimestamp(
  timestamp: string | Date,
  timeZone = "Asia/Shanghai",
): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid commit timestamp '${String(timestamp)}'.`);
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const year = values.get("year");
  const month = values.get("month");
  const day = values.get("day");

  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Cannot derive a release date in time zone '${timeZone}'.`);
  }

  return `${year}.${Number(month)}.${Number(day)}`;
}

export function nextPluginVersion(
  baseVersion: string,
  releaseDate: string,
): string {
  if (parseCalendarDate(releaseDate) === undefined) {
    throw new Error(`Invalid release date '${releaseDate}'.`);
  }

  const parsedBase = parsePluginVersion(baseVersion);

  if (parsedBase === undefined) {
    return `${releaseDate}-1`;
  }

  const comparison = compareCalendarDates(releaseDate, parsedBase.date);

  if (comparison < 0) {
    throw new Error(
      `Release date '${releaseDate}' predates base version '${baseVersion}'. Rebase onto the current PR base and regenerate the version.`,
    );
  }

  const sequence = comparison === 0 ? parsedBase.sequence + 1 : 1;

  if (!Number.isSafeInteger(sequence)) {
    throw new Error(`Version sequence after '${baseVersion}' is too large.`);
  }

  return `${releaseDate}-${sequence}`;
}

export function readManifestVersion(content: string, source: string): string {
  let manifest: unknown;

  try {
    manifest = JSON.parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot parse ${source}: ${message}`, { cause: error });
  }

  if (
    typeof manifest !== "object" ||
    manifest === null ||
    !("version" in manifest) ||
    typeof manifest.version !== "string"
  ) {
    throw new Error(`${source} must contain a string 'version' field.`);
  }

  return manifest.version;
}

export function replaceManifestVersion(
  content: string,
  source: string,
  version: string,
): string {
  let manifest: unknown;

  try {
    manifest = JSON.parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot parse ${source}: ${message}`, { cause: error });
  }

  if (typeof manifest !== "object" || manifest === null) {
    throw new Error(`${source} must contain a JSON object.`);
  }

  return `${JSON.stringify({ ...manifest, version }, null, 2)}\n`;
}
