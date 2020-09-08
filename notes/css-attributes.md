# Element Sizing Attributes

- width: the width of the element's content area
  - defined in pixels or any derivative values (eg. %, vw, etc.)
- height: the height of the element's content area
  - defined in pixels or a derivative value
- box-sizing: defines how the total width and height of an element is calculated. content-box is the default and means border widths are not included in the width and height calculation. this can cause elements with borders to not fit within containing divs. border-box includes borders in these calculations.

# Element Spacing Attributes

- margin: adds spacing between the element's content box and any adjacent elements or the edge of a parent element. increases the element's overall size.
- padding: adds spacing between the edge of the element's content box and any child elements. Does not increase the element's size.

# Element Positioning Attributes

- position: sets how an element is positioned within a document. [Further reading](https://developer.mozilla.org/en-US/docs/Web/CSS/position).
  - static: the default value. the element is positioned according to the normal flow of the document
  - relative: the element is placed via normal flow, then offset by any positioning attributes that are defined. Does NOT affect the positioning of any other elements, but causes the element's origin to act as the origin for any child elements that are using absolute position.
  - absolute: the element is removed from normal document flow. it is placed using the closest positioned parent as it's origin. defining positioning offsets the element from that parent element.

# Animation Properties

@keyframes animationName - defines an animation to be used in an animation property - define various keyframes at certain percentages - only animate opacity and transform attributes, as these are the only properties that browsers are optimized for.

- animation: shorthand for defining several animation properties in one property
- animation-name: the @keyframes to use for animating the element
- animation-duration: how long it should take to perform the animation
- animation-timing-function: how the animation accelerates or decelerates over time. used for customizing the feel of animations
- animation-delay: how long before the animation should begin
- animation-iteration-count: how many times the animation should repeat before stopping

# Font Attributes

- font-family: the font families that the browser will try to use. loaded in order from left to right, the first font that is found to be loaded is used to display the text.
- font-weight: the weight of the font, ie how thick/bold it is. different weights must be loaded in order to be used
- font-size: the height of the text in pixels or derivative value.
- line-height: property sets the height of a line box. It's commonly used to set the distance between lines of text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced inline elements, it specifies the height that is used to calculate line box height.
- color: sets the text color
- background-color: sets the color of the background.

# Text Attributes

- text-transform: uses functions to change the text in certain ways. eg. uppercase, lowercase
- text-decoration: allows for text stylings to be applied, such as colors, underline, etc. none clears all formatting

# Special Attributes

- clip-path: creates a mask for the element, only displaying parts of the element that are within the path.
- box-shadow: creates a drop shadow for the element
