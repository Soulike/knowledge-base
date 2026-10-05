# Mobile interface usability tradeoffs

## Scope

This document explains how to preserve a usable task path when an interface is
used on a small touch screen. It covers the tradeoffs among available features,
content priority, discoverable actions, loading cost, and the effort of learning
or returning to an interface across mobile web and app experiences.

## When to update

Update when evidence changes how small screens, touch input, device variants,
variable loading conditions, or first-time and returning use affect the choices
people can find and complete in mobile interfaces.

## Judge the whole task, not the size of one screen

A small display makes space scarce, but it does not change a person's goal by
itself. Someone using a phone may be traveling, sitting at a desk, or using it
as their main device. Base decisions about what to emphasize or omit on actual
tasks and use evidence rather than the assumption that mobile users only want
quick, simple actions.

Make each constraint and tradeoff explicit: what space, input, loading time, or
implementation effort is being saved, and what additional work is imposed on
the user? Count the entire route. An article split into many short pages may
look manageable on each screen yet require repeated loading, scrolling past
the same image, and searching for the next part. A compact layout is not an
improvement if reaching the answer becomes slower or more uncertain.

## Prioritize without losing access

Put frequent or time-sensitive actions close to hand. Less common actions can
sit deeper in the interface when their labels and route give people confidence
that they are moving toward the right result. More scrolling or tapping can be
reasonable on a small screen; guesses, dead ends, and costly wrong turns are
the stronger warning signs.

Check which tasks the smaller presentation must still support. Removing a
capability solely because it seems unlikely to be used on a phone can exclude
someone whose phone is their available device. When a capability is genuinely
unavailable in one presentation, explain the limitation and offer an available
alternative where one exists. Keep a direct link pointed at its intended
article or task rather than sending the person to a mobile home page. Do not
divert a supported task into an app-install prompt merely because the mobile
web presentation is incomplete.

When different screen sizes use separately maintained content or features,
recheck the supported tasks and direct destinations after changes. A route
that worked when the mobile presentation was first designed can disappear or
fall behind another version as the two evolve.

Keep text and controls usable at the supported screen sizes. If content needs
magnification, do not prevent the user from zooming where the platform offers
it. Check the actual narrow presentation and the path to secondary content;
merely fitting a page inside the viewport does not establish that the task is
available or understandable.

## Make touch actions visible and memorable

Touch use may offer no cursor or hover cue before an action. Show enough
distinction in label, shape, placement, state, or surrounding context for
people to recognize what can be activated and what it will do. A visually
quiet style can work, but removing decoration should not also remove the
clues that separate controls from ordinary content.

An unfamiliar gesture can be efficient once learned while leaving a primary
action undiscoverable. Give important actions a recognizable route and make
help or guidance available again when needed. A launch tour or tutorial is
useful only if people can apply it to the real task and recover it later; it
cannot make hidden controls self-explanatory. Check whether someone can perform
the action on first use and remember or readily rediscover it on a later visit.
Enjoyable motion or novel interaction adds value when it supports, rather than
obscures, task completion.

## Protect the response to the user's action

Show the content or result the user requested without making them wait for
unrelated material first. The cost of large images, repeated page loads, and
other resources can dominate a mobile route under variable connections. A
layout that adapts visually may still transfer unnecessary content. Inspect
the time and effort from an action to its useful result under the conditions
the product supports, including slower connections and repeated navigation.

## Validate the tradeoffs in context

Use representative tasks to check whether people can find both prominent and
secondary capabilities, follow a direct link to its intended content,
recognize touch actions, complete the task under realistic loading conditions,
and return later without relearning an opaque route. Record the screen size,
input method, network conditions, first-use or returning-use context, and the
observed path. A successful task after repeated guessing does not show that
the mobile tradeoff worked well.

## Source

- Steve Krug, _Don't Make Me Think, Revisited: A Common Sense Approach to Web
  Usability_ (New Riders, 2014), Chapter 10.
