const EMOJI_ENDPOINT = "https://cdn.discordapp.com/emojis/";
const STATIC = ".png?v=1";
const ANIMATED = ".gif?v=1";
const EMOJI = /[\[|&lt;|<]a?:\w+:?(\d+)[\]|&gt;|>]/g

var Discomoji = (function () {
    'use strict';
    /*Created by: Nathaniel Fernandes
      Date:       28/6/2021 */
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
            return `<img 
                    src='${EMOJI_ENDPOINT}${pack[1]}${((this.settings.animated && pack[0].includes("[a:")) ? ANIMATED : STATIC)}' 
                    width='${this.settings.width}' 
                    height='${this.settings.height}' 
                    style='transform:translate(${this.settings.offsetX}, ${this.settings.offsetY}); max-height:${this.settings['font-size']};
                    user-drag: ${this.settings['user-drag']}; 
                    user-select: ${this.settings['user-drag']};
                    -moz-user-select: ${this.settings['user-drag']};
                    -webkit-user-drag: ${this.settings['user-drag']};
                    -webkit-user-select: ${this.settings['user-drag']};
                    -ms-user-select: ${this.settings['user-drag']};'
                    >`
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
                "user-drag": "none"
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