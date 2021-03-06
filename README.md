<!-- # discomoji.js
Discord emojis without the hassle -->

<h1 align="left">
  discomoji.js
</h1>
<h3 align="left">discord emojis without the hassle.</h3>
<img src="https://cdn.discordapp.com/attachments/839576568518672467/859243222399975444/discomoji.gif">

<br>

# Usage
```html
<!DOCTYPE html>
<body>
    <div discomoji>Example Text a:speen:847583231850446858 </div> <!-- discomoji element-->
    <script type="text/javascript" src="discomoji.js"></script> <!-- Load discomoji.js library at the bottom of body -->
</body>
```
For dynamic uses, an element can be passed into Dicomoji.init()


# Options
(defaults included)
```js
width:              "auto", // Emoji width
height:             "auto", // Emoji Height
"font-size:"        window.getComputedStyle(this.element, null).getPropertyValue("font-size").replace(/\D/g, ''), // Emoji max height (in px)
offsetY:            (parseFloat(window.getComputedStyle(this.element, null).getPropertyValue("font-size")) / 6) + "px", // Emoji shift up/down
offsetX:            0, // Emoji shift left/right
animated:           true, // Allow emojis to be animated or not
draggable:          false // Allow emojis to be draggable or not
hoverinfo:          false // Displays emojis tag when hovered over
"emoji-only-scale": false // Set true if emojis should scale up to be larger when there is no text along with the emojis
onError:            "this.style.display='none';" // sets the onerror for the emoji's generate img tag
```

# Emoji Formats
(the animated emoji `a:speen:847583231850446858` is being used in these examples)


* `'<a:speen:847583231850446858>'`
* `'[a:speen:847583231850446858]'`
* `'(a:speen:847583231850446858)'`

Only emoji's that follow this format will be converted by discomoji. (both animated/static emoji formats are accepted)