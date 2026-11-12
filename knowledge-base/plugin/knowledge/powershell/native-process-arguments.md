# Native-process arguments from PowerShell

## Scope

This document explains how PowerShell process-launch interfaces carry arguments
to native programs. It owns the distinction between `Start-Process` command-line
text and .NET's separate argument values, the compatibility conditions for
choosing between them, and verification of the arguments received by the child.

## When to update

Update this document when PowerShell or .NET changes the supported launch
interfaces, argument handling, runtime availability, or platform behavior that
affects the child's received arguments.

## Check what the launch interface accepts

An argument supplied to a native program is a value, such as a report name
containing spaces. A PowerShell array can hold those values separately, but the
launch interface determines whether their boundaries survive process creation.

PowerShell's
[`Start-Process -ArgumentList`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/start-process#-argumentlist)
joins array elements into one space-separated command-line string. The quotes
that delimit strings in PowerShell source are not passed to the child. Thus
`-ArgumentList @('a b', '中文')` does not by itself ensure that the child receives
exactly two unchanged arguments. If retaining `Start-Process`, construct its
command-line text using the documented quoting contract for the launch path and
the target program; supplying an array does not remove that responsibility.

When available in the supported runtime and suitable for the required launch
behavior, .NET's
[`ProcessStartInfo.ArgumentList`](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.processstartinfo.argumentlist)
accepts separate values and performs their escaping. Add each intended value
without extra quote characters. This collection and the command-line string
property `Arguments` are alternative ways to supply arguments; use only one.
Check runtime availability and other process requirements before replacing an
existing launch interface.

These are distinct interfaces despite their similar names. Choosing the .NET
collection does not bypass the grammar of a later shell, interpreter, or target
utility. If the launched program interprets an argument as code, script text,
options, or another command line, that interpretation remains a separate
boundary to handle.

## Verify the child's received arguments

For example, a report generator may need the two values `a b` and `中文`. When
`ProcessStartInfo.ArgumentList` fits the supported runtime and launch behavior,
add those as two entries without quote characters around either value. A real
child reporting its arguments should receive a count of two and exactly those
two values. When using `Start-Process`, its command-line string must instead
encode the same intended values correctly for that launch path.

Exercise the application's actual launch path with a real child that reports
its received arguments. Compare their count and values with the intended
inputs. Cover spaces and Unicode, plus empty values, embedded quotes, and
backslashes when admitted by the supported input contract. A test that checks
only a wrapper's array cannot reveal a later interface splitting or changing
its elements.

Run the check on the PowerShell versions, runtimes, and operating systems the
application supports. An unavailable platform remains unverified; documentation
and a passing check on another host do not establish its runtime behavior.
