# Website navigation and orientation

## Scope

This document explains how to design navigation across a multi-page website so
people can find relevant content, understand their current location, and move
or recover within the site's structure, including when they arrive on an
internal page.

## When to update

Update when evidence changes how people browse or search within a site,
recognize its identity and sections, understand their position, use local and
recovery routes, or validate navigation from different entry points and depths.

## Start from any entry page

People may arrive from an external search result, bookmark, or shared link, so
an internal page may be their first encounter with the site. Its navigation
should reveal what the site contains, where this page fits, and where a person
can go next without requiring a visit to the home page or instructions about
how the site works. A recognizable route home can provide a fresh start, but it
does not replace orientation on the current page.

People may browse through plausible categories or search directly for a known
item. The same person may switch between these approaches according to the
task, time available, and confidence in the site's organization. Design the
routes around those needs rather than assigning users a permanent browsing or
searching type.

## Make browsing and search predictable

Group content under distinctions that people can recognize from their task.
Section names should suggest what lies behind them; once someone chooses a
section, show the relevant alternatives at the next level. Let a person back
up and try another plausible route when their first choice was wrong. A site
hierarchy that is visible only in an internal diagram does not help someone
find content on a page.

When the site's size or tasks make search useful, give it a recognizable entry
point and state its scope if people could mistake a section search for a
site-wide search. Keep the initial query simple. Offer scope or filter choices
when results make their value clear instead of making everyone decide about
them before searching. A small, readily browsable site may not need a search
control.

## Keep a recognizable frame across levels

Use a stable site identity and main navigation pattern so people can recognize
the site and reuse what they learned on other pages. Show local navigation for
the current section where the hierarchy needs it. Distinguish topical sections
from task utilities such as account or help when both are present, and give the
most useful utilities priority without relying on a fixed count or position.

On a focused task page, such as checkout or registration, some ordinary site
links may distract from completion. Reduce them when that serves the task while
retaining enough identity, help, and recovery for people to know where they are
and leave deliberately. Familiar placement and appearance can make navigation
easier to recognize, but check the intended audience and device context rather
than prescribing one layout. Tab-shaped section links are one possible
presentation when peer sections and the active one remain clear; visual polish
alone does not establish that they work.

## Carry orientation through the hierarchy

Design representative pages at every depth that the site will actually use.
A home page, top-level examples, and a site map cannot establish that local
choices and current-location cues still work several levels down. Work out the
deeper navigation with representative content before treating the structure as
finished.

Give each page a visible name that frames its unique content. The name should
match the link that led to it or be an obvious equivalent; an unexplained
change of terms makes people reconsider whether they reached the right place.
Mark the current section and subsection clearly enough to notice during a quick
scan. Use a visual cue beyond color, and make the current position identifiable
to assistive technology through text or appropriate programmatic state.

For a deep hierarchy, a breadcrumb trail can show structural ancestors and
offer a route to higher levels. It represents the page's place in the site, not
the user's click history. Distinguish the current page from ancestor links, and
keep local choices available when people still need to move among peers. The
W3C [breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
describes an ancestor trail within a navigation region.

## Validate from a deep entry point

Give a fresh reviewer or participant a realistic task starting on a
representative internal page, without first showing the home page. Ask them to
identify the site and page, locate the main and local choices, tell where they
are in the hierarchy, and find an appropriate search or recovery route when
the site offers one. Observe their first route, uncertainty, wrong turns, and
whether the page title and destination label agree. Repeat at lower levels and
with both browsing and search tasks where both routes matter.

A quick visual scan can reveal cues that are too subtle, but it does not prove
that people can navigate. Follow actual links with representative content and
check the supported narrow-screen, keyboard, and assistive-technology paths.

## Source

- Steve Krug, _Don't Make Me Think, Revisited: A Common Sense Approach to Web
  Usability_ (New Riders, 2014), Chapter 6.
