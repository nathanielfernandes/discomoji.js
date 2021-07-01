const EMOJI_ENDPOINT = "https://cdn.discordapp.com/emojis/";
const STATIC = ".png?v=1";
const ANIMATED = "";
const EMOJI = /(?:\[|<|\s|\()a?:\w+:?(\d+)(?:\]|>|\s|\))/g
const STYLES = `
/* styles injected by discomoji.js */
.discomoji-emoji{
    position: relative;
    display: inline-block;
  }
  
  .discomoji-emoji .discomoji-hover {
    font-size: 12px;
    visibility: hidden;
    width: auto;
    background-color: #222;
    color: white;
    text-align: center;
    border-radius: 5px;
    padding: 5px 5px;
    position: absolute;
    z-index: 1;
    bottom: 105%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .discomoji-emoji .discomoji-hover::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #222 transparent transparent transparent;
  }
  
  .discomoji-emoji:hover .discomoji-hover {
    visibility: visible;
    opacity: 1;
  }`


var css_inserted = false;

Discomoji = (function () {
    'use strict';

    class Discomoji {
        constructor(element, settings = {}) {
            if (!(element instanceof Node)) {
                throw ("Can't initialize Discomoji because " + element + " is not a Node.");
            }
            this.element = element;
            this.settings = this.extendSettings(settings);
            this.emojisFound = this.getEmojis(element);
            this.emojisFound.forEach(pack => this.replaceEmoji(pack));
        }

        genImageTag(pack) {
            var imgTag = `<img 
                    src='${EMOJI_ENDPOINT}${pack[1]}${((this.settings.animated) ? ANIMATED : STATIC)}' 
                    title='${(!this.settings.hoverable) ? pack[0].replace(/(?:\[|&lt;|<|\s|\(|\]|&gt;|>|\s|\))/g, '') : ''}'
                    width='${this.settings.width}' 
                    height='${this.settings.height}' 
                    style='transform:translate(${this.settings.offsetX}, ${this.settings.offsetY}); max-height:${this.settings['font-size']};
                    user-select: ${this.settings['user-select']};
                    -moz-user-select: ${this.settings['user-select']};
                    -webkit-user-drag: ${this.settings['user-select']};
                    -webkit-user-select: ${this.settings['user-select']};
                    -ms-user-select: ${this.settings['user-select']};'
                    >`;

            if (this.settings.hoverinfo) {
                this.insertCss();
                imgTag = `
                <div class="discomoji-emoji">
                    ${imgTag}
                    <span class="discomoji-hover">${pack[0].replace(/(?:\[|&lt;|<|\s|\(|\]|&gt;|>|\s|\))/g, '')}</span>
                </div>`
            }
            return imgTag;
        }

        insertCss() {
            if (!css_inserted) {
                var styles = document.createElement('style');
                if (styles.styleSheet)
                    styles.styleSheet.cssText = STYLES;
                else
                    styles.appendChild(document.createTextNode(STYLES));

                document.getElementsByTagName('head')[0].appendChild(styles);
                css_inserted = true;
            };
        }


        replaceEmoji(pack) {
            this.element.innerHTML = this.element.innerHTML.replace(pack[0], this.genImageTag(pack));
        }

        getEmojis(element) {
            return Array.from(element.innerText.matchAll(EMOJI));
        }

        extendSettings(settings) {
            let defaultSettings = {
                width: "auto",
                height: "auto",
                "font-size": window.getComputedStyle(this.element, null).getPropertyValue("font-size"),
                offsetY: (parseFloat(window.getComputedStyle(this.element, null).getPropertyValue("font-size")) / 6) + "px",
                offsetX: 0,
                animated: true,
                "user-select": "none",
                hoverinfo: false
            };
            let newSettings = {};
            for (var property in defaultSettings) {
                if (property in settings) {
                    newSettings[property] = settings[property];
                } else if (this.element.hasAttribute("discomoji-" + property)) {
                    let attribute = this.element.getAttribute("discomoji-" + property);
                    try {
                        newSettings[property] = JSON.parse(attribute);
                    } catch (e) {
                        newSettings[property] = attribute;
                    }
                } else {
                    newSettings[property] = defaultSettings[property];
                }
            }
            return newSettings;
        }

        static init(elements, settings) {
            if (elements instanceof Node) {
                elements = [elements];
            }

            if (elements instanceof NodeList) {
                elements = [].slice.call(elements);
            }

            if (!(elements instanceof Array)) {
                return;
            }

            elements.forEach((element) => {
                if (!("discomoji" in element)) {
                    element.discomoji = new Discomoji(element, settings);
                }
            });
        }
    }

    if (typeof document !== "undefined") {
        window.Discomoji = Discomoji
        Discomoji.init(document.querySelectorAll("[discomoji]"))
    }
    return Discomoji;
}());