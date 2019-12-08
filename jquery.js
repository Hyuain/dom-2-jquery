window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
    let elements
    if (typeof selectorOrArrayOrTemplate === 'string') {
        if (selectorOrArrayOrTemplate[0] === '<') {
            elements = Array.from(createElement(selectorOrArrayOrTemplate))
        } else {
            elements = document.querySelectorAll(selectorOrArrayOrTemplate)
        }
    } else if (selectorOrArrayOrTemplate instanceof Array) {
        elements = selectorOrArrayOrTemplate
    }

    function createElement(string) {
        const container = document.createElement('template')
        container.innerHTML = string.trim()
        return container.content.children
    }

    // api 可以操作 elements
    const api = Object.create(jQuery.prototype)

    // 每个对象的私有属性
    Object.assign(api, {
        elements: elements,
        oldApi: selectorOrArrayOrTemplate.oldApi
    })
    return api
}

jQuery.fn = jQuery.prototype = {
    // 每个对象的共有属性
    constructor: jQuery,
    jquery: true,
    get(i = undefined) {
        return i === undefined ? this.elements : this.elements[i]
    },
    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el))
        } else if (node.jquery === true) {
            this.each(el => node.get(0).appendChild(el))
        }
    },
    append(children) {
        if (children instanceof Element) {
            this.get(0).appendChild(children)
        } else if (children instanceof HTMLCollection) {
            for (let i = 0; i < children.length; i++) {
                this.get(0).appendChild(children[i])
            }
        } else if (children.jquery === true) {
            children.each(el => this.get(0).appendChild(el))
        }
    },
    addClass(className) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add(className)
        }
        return this
    },
    find(selector) {
        let array = []
        for (let i = 0; i < this.elements.length; i++) {
            array.push(...this.elements[i].querySelectorAll(selector))
        }
        array.oldApi = this
        return jQuery(array)
    },
    end() {
        return this.oldApi
    },
    each(fn) {
        for (let i = 0; i < this.elements.length; i++) {
            fn.call(null, this.elements[i], i)
        }
        return this
    },
    parent() {
        const array = []
        this.each(node => {
            if (array.indexOf(node.parentNode) === -1)
                array.push(node.parentNode)
        })
        return jQuery(array)
    },
    print(i = undefined) {
        i === undefined ? console.log(this.elements) : console.log(this.elements[i])
    },
    children() {
        const array = []
        this.each(node => {
            array.push(...node.children)
        })
        return jQuery(array)
    },
    siblings() {
        const me = this.elements[0]
        return jQuery(
            Array.from(me.parentNode.children).filter(n => n !== me)
        )
    },
    index() {
        const me = this.elements[0]
        const parent = me.parentNode
        let i
        for (i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === me) {
                return i
            }
        }
    },
    next() {
        const me = this.elements[0]
        let array = []
        array.push(me.nextElementSibling)
        return jQuery(array)
    },
    previous() {
        const me = this.elements[0]
        let array = []
        array.push(me.previousElementSibling)
        return jQuery(array)
    },
}
