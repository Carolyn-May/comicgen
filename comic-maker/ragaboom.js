var RB = {};
RB.Scene = function(b, k) {
    if (!b) throw "RB.Scene(canvasObject): You must specify a canvas object";
    k || (k = 24);
    this.timeInterval = k;
    var n = document;
    this.ctx = b.getContext("2d");
    var d = [],
        m = null,
        u = !1,
        z = !1,
        s = !1,
        p = !1,
        v = !1,
        t = null,
        A = 0,
        l = 0,
        q = [],
        r = [],
        w = !1,
        x = 0,
        a = 0,
        y = 0;
    this.genID = function() {
        return "RB_OBJECT" + y++
    };
    this.add = function(c) {
        if (!c) throw "RB.Scene.add(o): the object you are trying to add to the scene doesn't exist.";
        d.push(c);
        c.collidable && q.push(c);
        c.draggable && r.push(c);
        return c
    };
    this.addLots = function(c) {
        for (var i = 0; i <
            c.length; i++) this.add(c[i])
    };
    this.remove = function(c) {
        for (var c = c.getId(), i = d.length, a = r.length, h = q.length, e = 0; e < i; e++)
            if (c == d[e].getId()) {
                d.splice(e, 1);
                break
            }
        for (e = 0; e < h; e++)
            if (c == q[e].getId()) {
                q.splice(e, 1);
                break
            }
        for (e = 0; e < a; e++)
            if (c == r[e].getId()) {
                r.splice(e, 1);
                break
            }
    };
    this.removeLots = function(c) {
        for (var i = 0; i < c.length; i++) this.remove(c[i])
    };
    this.removeAll = function() {
        var c = r.length,
            i = q.length;
        d.splice(0, d.length);
        q.splice(0, i);
        r.splice(0, c)
    };
    this.zIndex = function(c, i) {
        var a = d.length,
            h = getIdByObject(c),
            e = h + i;
        e < 0 && (e = 0);
        e >= a && (e = a - 1);
        a = d[h];
        d[h] = d[e];
        d[e] = a
    };
    getObjectById = function(c) {
        for (var a = d.length, f = 0; f < a; f++)
            if (d[f].getId() == c) return o;
        return null
    };
    getIdByObject = function(c) {
        for (var a = d.length, f = 0; f < a; f++)
            if (d[f].getId() == c.getId()) return f;
        return null
    };
    this.setMovableObject = function(c) {
        m = typeof c == "object" ? c.getId() : c
    };
    this.getMovableObject = function() {
        return getObjectById(m)
    };
    var B = function(c, a) {
        switch (c.keyCode) {
            case 37:
                u = a;
                break;
            case 38:
                s = a;
                break;
            case 39:
                z = a;
                break;
            case 40:
                p = a
        }
    };
    this.onmousemove =
        function() {};
    this.onmousedown = function() {};
    this.onmouseup = function() {};
    this.onkeydown = function() {};
    this.onkeyup = function() {};
    var j = this;
    b.onmousemove = function(c) {
        if (v && t) t.x = RB.xPos(c) - A, t.y = RB.yPos(c) - l, w || j.update();
        j.onmousemove(c)
    };
    b.onmousedown = function(c) {
        for (var a = r.length - 1; a >= 0; a--) {
            var f = r[a];
            if (f.checkRange(RB.xPos(c), RB.yPos(c))) {
                f.onmousedown(c);
                t = f;
                currentObjectIndex = a;
                A = RB.xPos(c) - t.x;
                l = RB.yPos(c) - t.y;
                v = !0;
                break
            }
        }
        j.onmousedown(c)
    };
    b.onmouseup = function(c) {
        v = !1;
        j.onmouseup(c)
    };
    n.onkeydown =
        function(c) {
            B(c, !0);
            j.onkeydown(c)
        };
    n.onkeyup = function(c) {
        B(c, !1);
        j.onkeyup(c)
    };
    this.getObjectSize = function() {
        return d.length
    };
    this.getObj = function(c) {
        return d[c]
    };
    this.rect = function(c, a, f, h, e) {
        var h = h || this.genID(),
            h = RB.createCanvas(c, a, h),
            g = h.getContext("2d");
        if (f) g.fillStyle = RB.getFS(f, g, a), g.fillRect(0, 0, c, a);
        if (e) f = e.lineWidth || 1, g.lineWidth = e.lineWidth, g.strokeStyle = e.strokeStyle, g.rect(0 + f, 0 + f, c - f - f, a - f - f), g.stroke();
        return rectObj = new RB.Obj(h, this.ctx)
    };
    this.image = function(c, i, f) {
        var h = new Image,
            e = this,
            g = null;
        h.onload = function() {
            f = f || e.genID();
            g = RB.createCanvas(h.width, h.height, f);
            g.getContext("2d").drawImage(this, 0, 0);
            a++;
            var c = new RB.Obj(g, e.ctx);
            i(c)
        };
        h.src = c;
        x++
    };
    this.loadImage = function(c, i, f) {
        var h = new Image,
            e = this,
            g = null;
        h.onload = function() {
            i = i || e.genID();
            g = RB.createCanvas(h.width, h.height, i);
            g.getContext("2d").drawImage(this, 0, 0);
            a++;
            f(g)
        };
        h.src = c;
        x++
    };
    this.imagePattern = function(c, i, f, h, e) {
        var g = new Image,
            b = this;
        g.onload = function() {
            e = e || b.genID();
            var c = RB.createCanvas(i, f, e).getContext("2d"),
                d = c.createPattern(g, h);
            c.fillStyle = d;
            c.fillRect(0, 0, i, f);
            a++;
            a == x && b.doAfterLoad()
        };
        g.src = c;
        x++
    };
    this.roundRect = function(c, a, f, h, e, g) {
        var e = e || this.genID(),
            e = RB.createCanvas(c, a, e),
            b = e.getContext("2d");
        b.beginPath();
        b.moveTo(0 + f, 0);
        b.lineTo(c + 0 - f, 0);
        b.quadraticCurveTo(c + 0, 0, c + 0, 0 + f);
        b.lineTo(c + 0, a + 0 - f);
        b.quadraticCurveTo(c + 0, 0 + a, c + 0 - f, 0 + a);
        b.lineTo(0 + f, 0 + a);
        b.quadraticCurveTo(0, 0 + a, 0, 0 + a - f);
        b.lineTo(0, 0 + f);
        b.quadraticCurveTo(0, 0, 0 + f, 0);
        b.closePath();
        if (h) b.fillStyle = RB.getFS(h, b, a), b.fill();
        if (g) b.lineWidth =
            g.lineWidth, b.strokeStyle = g.strokeStyle, b.stroke();
        return new RB.Obj(e, this.ctx)
    };
    this.text = function(a, b, f, h, e) {
        var g = RB.getTextBuffer(),
            e = e || this.genID();
        g.innerHTML = a;
        g.style.fontFamily = b;
        g.style.fontSize = f + "px";
        var d = RB.el(e);
        d ? (e = d.getContext("2d"), d.width = g.offsetWidth, d.height = g.offsetHeight + 15, e.clearRect(0, 0, g.offsetWidth, g.offsetHeight + 15)) : (d = RB.createCanvas(g.offsetWidth, g.offsetHeight + 15, e), e = d.getContext("2d"));
        e.fillStyle = RB.getFS(h, e, g.offsetHeight + 25);
        e.font = "normal " + f + "px " + b;
        e.fillText(a,
            0, g.offsetHeight + 5);
        return new RB.Obj(d, this.ctx)
    };
    this.start = function() {
        w = !0;
        this.animate()
    };
    this.stop = function() {
        w = !1
    };
    this.toggleStart = function() {
        w ? this.stop() : this.start()
    };
    this.onLoop = function() {};
    this.runOnce = function() {
        this.ctx.restore();
        for (var a = d.length, b = q.length, f = 0; f < a; f++) {
            var h = d[f];
            if (h.visible) {
                h.run();
                if (h.collidable && !h.obstacle)
                    for (var e = 0; e < b; e++) {
                        var g = q[e];
                        if (h.getId() != g.getId())
                            if (g = h.checkCollision(g, !0), g.top || g.bottom || g.left || g.right) {
                                h.colliding = !0;
                                h.collidingCoords =
                                    g;
                                break
                            } else h.colliding = !1, h.collidingCoords = null
                    }
                e = u || z || p || s;
                if (h.getId() == m && e) {
                    var B = g = e = !1,
                        j = !1,
                        y = h.collidingCoords;
                    if (y) e = y.left, g = y.right, B = y.top, j = y.bottom;
                    u && !e && h.left();
                    z && !g && h.right();
                    s && !B && h.up();
                    p && !j && h.down()
                }
            }
        }
        this.ctx.save()
    };
    this.animate = function() {
        this.runOnce();
        this.onLoop();
        if (w) {
            var a = this;
            setTimeout(function() {
                a.animate()
            }, this.timeInterval)
        }
    };
    this.update = function() {
        for (var a = d.length, b = 0; b < a; b++) d[b].run()
    };
    this.doAfterLoad = function() {}
};
RB.Obj = function(b, k, n, d) {
    if (!k) throw "RB.Obj(c, sceneContext, _x, _y): You must specify a scene context";
    var m = Math.random(),
        u = k,
        z = null,
        s = null;
    this.h = this.w = this.y = this.x = 0;
    if (n) this.x = n;
    if (d) this.y = d;
    this.w = b.width;
    this.h = b.height;
    this.onmousedown = function() {};
    this.visible = !0;
    this.colliding = this.obstacle = this.collidable = !1;
    var p = this.collidingCoords = null;
    this.draggable = !1;
    this.speedY = this.speedX = 1;
    var v = null;
    this.spriteChangeInterval = 1;
    var t = 0,
        A = 0;
    this.setCanvas = function(a) {
        s = typeof a == "object" ? a :
            RB.el(a);
        this.w = s.width;
        this.h = s.height
    };
    this.setCoords = function(a, b) {
        this.x = a;
        this.y = b
    };
    this.setDimension = function(a, b) {
        this.w = a;
        this.h = b
    };
    this.setCanvas(b);
    this.getCanvas = function() {
        return s
    };
    this.getId = function() {
        return m
    };
    this.setSCtx = function(a) {
        u = a
    };
    this.getSCtx = function() {
        return u
    };
    this.setCtx = function(a) {
        z = a
    };
    this.getCtx = function() {
        return z
    };
    this.setXY = function(a, b) {
        this.x = a;
        this.y = b
    };
    this.setSpeed = function(a) {
        this.speedY = this.speedX = a
    };
    this.getX2 = function() {
        return this.x + this.w
    };
    this.getY2 =
        function() {
            return this.y + this.h
        };
    this.fn = function() {
        this.draw()
    };
    this.run = function() {
        this.fn()
    };
    this.clone = function() {
        var a = new RB.Obj(b, u);
        a.x = this.x;
        a.y = this.y;
        a.w = this.w;
        a.h = this.h;
        a.collidable = this.collidable;
        a.obstacle = this.obstacle;
        a.fn = this.fn;
        a.speedX = this.speedX;
        a.speedY = this.speedY;
        a.setSprites(v, this.spriteChangeInterval);
        a.draggable = this.draggable;
        a.visible = this.visible;
        return a
    };
    this.draw = function(a, b) {
        try {
            a && b ? u.drawImage(s, this.x, this.y, a, b) : u.drawImage(s, this.x, this.y, this.w, this.h)
        } catch (d) {
            throw d;
        }
    };
    this.up = function(a) {
        this.y -= a || this.speedY;
        p = "up"
    };
    this.down = function(a) {
        this.y += a || this.speedY;
        p = "down"
    };
    this.left = function(a) {
        this.x -= a || this.speedX;
        p = "left"
    };
    this.right = function(a) {
        this.x += a || this.speedX;
        p = "right"
    };
    this.setSprites = function(a, b) {
        v = a;
        spriteChangeInterval = b
    };
    this.animateSprite = function() {
        t == spriteChangeInterval ? (s = v[++A] ? v[A] : v[A = 0], t = 0) : t++
    };
    this.checkCollision = function(a, b) {
        var d = a.x,
            j = a.y,
            c = a.getX2(),
            i = a.getY2();
        b && (d -= this.speedX, j -= this.speedY, c += this.speedX, i += this.speedY);
        var f = {
            top: !1,
            bottom: !1,
            left: !1,
            right: !1
        };
        if (p == "up") f.top = w(d, j, c, i), f.left = q(d, j, c, i), f.right = r(d, j, c, i);
        if (p == "down") f.bottom = x(d, j, c, i), f.left = q(d, j, c, i), f.right = r(d, j, c, i);
        if (p == "right") f.right = r(d, j, c, i), f.top = w(d, j, c, i), f.bottom = x(d, j, c, i);
        if (p == "left") f.left = q(d, j, c, i), f.top = w(d, j, c, i), f.bottom = x(d, j, c, i);
        return f
    };
    var l = this,
        q = function(a, b, d, j) {
            a = l.y < j && l.getY2() > b;
            d = l.x < d && l.getX2() > d;
            return a && d
        },
        r = function(a, b, d, j) {
            b = l.y < j && l.getY2() > b;
            a = l.getX2() > a && l.getX2() < d;
            return b && a
        },
        w = function(a,
            b, d, j) {
            b = l.y < j && l.getY2() > j;
            a = l.x < d && l.getX2() > a;
            return b && a
        },
        x = function(a, b, d, j) {
            b = l.getY2() > b && l.getY2() < j;
            a = l.x < d && l.getX2() > a;
            return b && a
        };
    this.checkRange = function(a, b) {
        var d = a >= this.x && a <= this.getX2(),
            j = b >= this.y && b <= this.getY2();
        return d && j
    }
};
RB.createTextBuffer = function() {
    var b = document,
        k = b.createElement("div");
    k.id = "txtBuffer";
    k.style.position = "absolute";
    k.style.width = "auto";
    k.style.height = "auto";
    k.style.padding = "0px";
    k.style.visibility = "hidden";
    b.body.appendChild(k)
};
RB.getTextBuffer = function() {
    RB.el("txtBuffer") || RB.createTextBuffer();
    return RB.el("txtBuffer")
};
RB.createCanvasLocation = null;
RB.createCanvas = function(b, k, n) {
    var d = document,
        m = d.createElement("canvas");
    m.width = b;
    m.height = k;
    m.id = n;
    m.style.display = "none";
    RB.createCanvasLocation ? RB.createCanvasLocation.appendChild(m) : d.body.appendChild(m);
    return m
};
RB.destroyCanvas = function(b) {
    var k = document,
        b = k.getElementById(b);
    k.body.removeChild(b)
};
RB.el = function(b) {
    return document.getElementById(b)
};
RB.linearGradient = function(b, k) {
    var n = k.createLinearGradient(0, 5, 0, b.h);
    csLen = b.colors.length;
    for (var d = 0; d < csLen; d++) {
        var m = b.colors[d];
        n.addColorStop(m.stopPoint, m.name)
    }
    return n
};
RB.getFS = function(b, k, n) {
    if (typeof b == "object") return b.h = n, RB.linearGradient(b, k);
    return b
};
RB.rtImage = function(b, k, n) {
    var d = new Image;
    d.onload = function() {
        var b = RB.createCanvas(d.width, d.height, k);
        b.getContext("2d").drawImage(this, 0, 0);
        n && n(b)
    };
    d.src = b
};
RB.canvasSupport = function(b) {
    if (b) try {
        return b.getContext("2d"), !0
    } catch (k) {
        return !1
    } else return !1
};
RB.xPos = function(b) {
    return b.pageX - b.target.offsetLeft
};
RB.yPos = function(b) {
    return b.pageY - b.target.offsetTop
};

