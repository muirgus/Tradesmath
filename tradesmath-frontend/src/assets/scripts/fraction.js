!(function (n, t) {
    "object" == typeof exports && "object" == typeof module
        ? (module.exports = t())
        : "function" == typeof define && define.amd
        ? define([], t)
        : "object" == typeof exports
        ? (exports.fc = t())
        : (n.fc = t());
})("undefined" != typeof window ? window : this, function () {
    return (function (n) {
        var t = {};
        function r(e) {
            if (t[e]) return t[e].exports;
            var o = (t[e] = { i: e, l: !1, exports: {} });
            return n[e].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
        }
        return (
            (r.m = n),
            (r.c = t),
            (r.d = function (n, t, e) {
                r.o(n, t) ||
                    Object.defineProperty(n, t, { enumerable: !0, get: e });
            }),
            (r.r = function (n) {
                "undefined" != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(n, Symbol.toStringTag, {
                        value: "Module",
                    }),
                    Object.defineProperty(n, "__esModule", { value: !0 });
            }),
            (r.t = function (n, t) {
                if ((1 & t && (n = r(n)), 8 & t)) return n;
                if (4 & t && "object" == typeof n && n && n.__esModule)
                    return n;
                var e = Object.create(null);
                if (
                    (r.r(e),
                    Object.defineProperty(e, "default", {
                        enumerable: !0,
                        value: n,
                    }),
                    2 & t && "string" != typeof n)
                )
                    for (var o in n)
                        r.d(
                            e,
                            o,
                            function (t) {
                                return n[t];
                            }.bind(null, o)
                        );
                return e;
            }),
            (r.n = function (n) {
                var t =
                    n && n.__esModule
                        ? function () {
                              return n.default;
                          }
                        : function () {
                              return n;
                          };
                return r.d(t, "a", t), t;
            }),
            (r.o = function (n, t) {
                return Object.prototype.hasOwnProperty.call(n, t);
            }),
            (r.p = ""),
            r((r.s = 0))
        );
    })([
        function (n, t, r) {
            "use strict";
            function e(n) {
                if (Number.isInteger(n)) return 0;
                const t = `${n}`;
                return t.length - t.indexOf(".") - 1;
            }
            function o(n, t) {
                let r = (n = Math.abs(n)) % (t = Math.abs(t));
                for (; 0 !== r; ) r = (n = t) % (t = r);
                return t;
            }
            function i(n, t) {
                return (Math.abs(n) * Math.abs(t)) / o(n, t);
            }
            function u(n) {
                const { numerator: t, denominator: r } = n;
                return t < 0 && r < 0
                    ? { numerator: Math.abs(t), denominator: Math.abs(r) }
                    : t < 0 || r < 0
                    ? { numerator: -Math.abs(t), denominator: Math.abs(r) }
                    : n;
            }
            function a(n) {
                return Number(`${n}`.replace(".", ""));
            }
            function f(n) {
                let { numerator: t, denominator: r } = n;
                if (Number.isInteger(t) && Number.isInteger(r))
                    return { numerator: t, denominator: r };
                const o = e(t) - e(r);
                return (
                    (t = a(t)),
                    (r = a(r)),
                    o > 0
                        ? (r *= Number(`1e${o}`))
                        : o < 0 && (t *= Number(`1e${-o}`)),
                    { numerator: t, denominator: r }
                );
            }
            function c(n) {
                let t = f(n);
                const { numerator: r, denominator: e } = t,
                    i = o(r, e);
                return { numerator: r / i, denominator: e / i };
            }
            function m(n, t) {
                return new m.fn.init(n, t);
            }
            function s(n) {
                let t = Number(n),
                    r = { numerator: t, denominator: 1 };
                if (!Number.isFinite(t))
                    throw new Error("Unsupported number NaN or Infinity");
                return Number.isInteger(t) || (r = f(r)), r;
            }
            function d(n, t, r) {
                const e = n.match(t);
                let o = e[1] || "0";
                const i = e[2],
                    u = i.length,
                    a = e[3],
                    f = a.length;
                let c = `${i}/${Number(`1e${u}`)}`,
                    s = "";
                for (let n = 0; n < f; n++) s += "9";
                s = Number(s) * Number(`1e${u}`);
                const d = `${a}/${s}`,
                    l = m(c).plus(d).plus(Number(o)),
                    {
                        fraction: { numerator: h, denominator: b },
                    } = l;
                return { numerator: r ? h : -h, denominator: b };
            }
            r.r(t),
                (m.fn = m.prototype = {}),
                (m.fn.init = function (n, t) {
                    this.fraction = m.getFraction(n, t);
                }),
                (m.fn.init.prototype = m.fn);
            const l = function (n, t) {
                if ("number" == typeof n && "number" == typeof t && 0 !== t) {
                    let r = { numerator: n, denominator: t };
                    return (r = u(r)), (r = f(r)), r;
                }
                if ("number" == typeof n) return s(n);
                if ("string" == typeof n)
                    return (function (n) {
                        let t = String(n).trim(),
                            r = !0;
                        const e = t[0];
                        "-" === e
                            ? ((r = !1), (t = t.slice(1)))
                            : "+" === e && (t = t.slice(1));
                        const o = /^(\d*).(\d*)'(\d+)'$/,
                            i = /^(\d*).(\d*)\((\d+)\)$/;
                        if (o.test(t)) return d(t, o, r);
                        if (i.test(t)) return d(t, i, r);
                        let a,
                            f = 0;
                        t.includes(" ") &&
                            ((a = t.split(" ")),
                            (f = Number(a[0])),
                            (t = a[1])),
                            (a = t.split("/"));
                        let c = a.length;
                        if (f) {
                            const n = Number(a[0]) + f * Number(a[1]);
                            let t = {
                                numerator: Number(`${r ? "" : "-"}${n}`),
                                denominator: Number(a[1]),
                            };
                            return (t = u(t)), t;
                        }
                        {
                            const n = Number(`${r ? "" : "-"}${a[0]}`);
                            if (1 === c) return s(n);
                            if (Number(a[1])) {
                                let t = {
                                    numerator: n,
                                    denominator: Number(a[1]),
                                };
                                return (t = u(t)), t;
                            }
                            throw new Error("Denominator can't be 0 or NaN");
                        }
                    })(n);
                if (n instanceof m) return { ...n.fraction };
                throw new Error(`Unsupported parameter ${n}`);
            };
            (m.DISABLE_REDUCE = !1),
                (m.getFraction = l),
                (m.gcd = function (n, t) {
                    if (Number.isFinite(n) && Number.isFinite(t))
                        return o(n, t);
                    throw new Error("Invalid Parameter");
                }),
                (m.lcm = function (n, t) {
                    if (Number.isFinite(n) && Number.isFinite(t))
                        return i(n, t);
                    throw new Error("Invalid Parameter");
                }),
                (m.fn.toFraction = function (n = !1) {
                    let t = this.fraction;
                    m.DISABLE_REDUCE || (t = c(t));
                    const { numerator: r, denominator: e } = t;
                    if (0 === r) return "0";
                    if (1 === e) return `${r}`;
                    if (n) {
                        const n = parseInt(r / e),
                            t = Math.abs(r % e);
                        if (0 !== n) return `${n} ${t}/${e}`;
                    }
                    return `${r}/${e}`;
                }),
                (m.fn.toFixed = function (n) {
                    const {
                        fraction: { numerator: t, denominator: r },
                    } = this;
                    return (t / r).toFixed(n);
                }),
                (m.fn.toNumber = function () {
                    const {
                        fraction: { numerator: n, denominator: t },
                    } = this;
                    return n / t;
                }),
                (m.fn.toRecurringDecimal = function () {
                    let { fraction: n } = this;
                    n = c(n);
                    let { numerator: t, denominator: r } = n,
                        e = !0;
                    t < 0 && ((e = !1), (t = -t));
                    const o = parseInt(t / r);
                    t -= o * r;
                    const i = e ? "" : "-";
                    return 0 === t
                        ? `${i}${o}`
                        : `${i}${o}.${(function (n, t) {
                              const r = {},
                                  e = [];
                              let o,
                                  i = 0;
                              for (;;) {
                                  if (((o = n % t), 0 === o)) return e.join("");
                                  let u = r[o];
                                  if (u >= 0) {
                                      let n = e.length;
                                      return (
                                          e.splice(u, 0, "("),
                                          e.splice(n + 1, 0, ")"),
                                          e.join("")
                                      );
                                  }
                                  (r[o] = i), i++, (n = 10 * o);
                                  let a = parseInt(n / t);
                                  if ((e.push(a), i >= 3e3)) return e.join("");
                              }
                          })(t, r)}`;
                }),
                (m.fn.plus = function (n) {
                    const t = (function (n, t) {
                            (n = f(n)), (t = f(t));
                            const r = n.denominator,
                                e = t.denominator,
                                o = i(r, e),
                                u = o / e;
                            return {
                                fractionA: {
                                    numerator: (o / r) * n.numerator,
                                    denominator: o,
                                },
                                fractionB: {
                                    numerator: u * t.numerator,
                                    denominator: o,
                                },
                            };
                        })(this.fraction, l(n)),
                        r = t.fractionA,
                        e = t.fractionB,
                        o = {
                            numerator: r.numerator + e.numerator,
                            denominator: r.denominator,
                        };
                    return (this.fraction = o), this;
                }),
                (m.fn.minus = function (n) {
                    const t = l(n);
                    return (
                        (t.numerator = -t.numerator),
                        this.plus(`${t.numerator}/${t.denominator}`)
                    );
                }),
                (m.fn.times = function (n) {
                    let t = this.fraction,
                        r = l(n);
                    (t = f(t)), (r = f(r));
                    const e = {
                        numerator: t.numerator * r.numerator,
                        denominator: t.denominator * r.denominator,
                    };
                    return (
                        (this.fraction = e),
                        (this.fraction = u(this.fraction)),
                        this
                    );
                }),
                (m.fn.div = function (n) {
                    const t = l(n),
                        { numerator: r, denominator: e } = t;
                    return this.times(`${e}/${r}`);
                }),
                (m.fn.pow = function (n) {
                    const {
                            fraction: { numerator: t, denominator: r },
                        } = this,
                        e = Math.pow(t, n),
                        o = Math.pow(r, n);
                    let i;
                    if (Number.isFinite(e) || Number.isFinite(o)) {
                        if (
                            ((i =
                                n < 0
                                    ? { numerator: 1 / o, denominator: 1 / e }
                                    : { numerator: e, denominator: o }),
                            Number.isFinite(i.denominator))
                        ) {
                            if (!Number.isFinite(i.numerator))
                                throw new Error("Numerator reached Infinity");
                        } else i = { numerator: 0, denominator: 1 };
                        return (
                            (this.fraction = i),
                            (this.fraction = u(this.fraction)),
                            this
                        );
                    }
                    throw new Error("Numerator reached Infinity");
                }),
                (m.fn.sqrt = function () {
                    const {
                        fraction: { numerator: n },
                    } = this;
                    if (n < 0)
                        throw new Error("Sqrt number cannot less than 0");
                    return this.pow(0.5);
                }),
                (m.fn.abs = function () {
                    const {
                        fraction: { numerator: n },
                    } = this;
                    return (this.fraction.numerator = Math.abs(n)), this;
                }),
                (m.fn.neg = function () {
                    const {
                        fraction: { numerator: n },
                    } = this;
                    return (this.fraction.numerator = -n), this;
                }),
                (m.fn.inverse = function () {
                    const {
                        fraction: { numerator: n, denominator: t },
                    } = this;
                    let r = { numerator: t, denominator: n };
                    return (this.fraction = u(r)), this;
                }),
                (m.fn.clone = function () {
                    return m(this);
                }),
                (m.fn.ceil = function () {
                    const {
                        fraction: { numerator: n, denominator: t },
                    } = this;
                    return (
                        (this.fraction = {
                            numerator: Math.ceil(n / t),
                            denominator: 1,
                        }),
                        this
                    );
                }),
                (m.fn.floor = function () {
                    const {
                        fraction: { numerator: n, denominator: t },
                    } = this;
                    return (
                        (this.fraction = {
                            numerator: Math.floor(n / t),
                            denominator: 1,
                        }),
                        this
                    );
                }),
                (m.fn.round = function () {
                    const {
                        fraction: { numerator: n, denominator: t },
                    } = this;
                    return (
                        (this.fraction = {
                            numerator: Math.round(n / t),
                            denominator: 1,
                        }),
                        this
                    );
                }),
                (m.fn.equals = function (n) {
                    return 0 === this.clone().minus(n).fraction.numerator;
                }),
                (m.fn.greaterThan = function (n) {
                    return this.clone().minus(n).fraction.numerator > 0;
                }),
                (m.fn.lessThan = function (n) {
                    return this.clone().minus(n).fraction.numerator < 0;
                }),
                (m.fn.mod = function (n) {
                    const t = this.clone().div(n),
                        {
                            fraction: { numerator: r, denominator: e },
                        } = t,
                        o = parseInt(r / e);
                    return this.minus(m(n).times(o));
                });
            t.default = m;
        },
    ]).default;
});
