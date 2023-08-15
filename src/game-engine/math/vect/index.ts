export class Vect2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    static get up() {
        return new Vect2(0, -1);
    }

    static get down() {
        return new Vect2(0, 1);
    }

    static get left() {
        return new Vect2(-1, 0);
    }

    static get right() {
        return new Vect2(1, 0);
    }

    mag() {
        return this.dot(this);
    }

    norm() {
        let m = this.mag();
        if (m > 0) {
            this.div(m);
            return this;
        }
        return this
    }

    dot(vect: Vect2) {
        return Math.sqrt(this.x * vect.x + this.y * vect.y)
    }

    dir(target: Vect2) {
        return new Vect2(this.x - target.x, this.y - target.y)
    }

    dist(target: Vect2): number {
        return Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2));
    }

    add(v: Vect2) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v: Vect2) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    set(v: Vect2) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    div(scalar: number) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    mult(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divBy(v: Vect2, scalar: number) {
        return new Vect2((v.x /= scalar), (v.y /= scalar));
    }

    clone(): Vect2 {
        return new Vect2(this.x, this.y);
    }

    static dot(v: Vect2, o: Vect2) {
        return Math.sqrt(v.x * o.x + v.y * o.y)
    }

    static norm(vect: Vect2) {
        let m = Vect2.mag(vect);
        if (m > 0) {
            return Vect2.div(vect, m);
        }
        return vect;
    }

    static dist(v: Vect2, o: Vect2): number {
        return Math.sqrt(Math.pow(v.x - o.x, 2) + Math.pow(v.y - o.y, 2));
    }

    static dir(source: Vect2, target: Vect2) {
        return new Vect2(target.x - source.x, target.y - source.y)
    }

    static mag(vect: Vect2): number {
        return Math.sqrt(vect.x * vect.x + vect.y * vect.y);
    }

    static add(v: Vect2, o: Vect2): Vect2 {
        return new Vect2(v.x + o.x, v.y + o.y);
    }

    static sub(v: Vect2, o: Vect2): Vect2 {
        return new Vect2(v.x - o.x, v.y - o.y);
    }

    static mult(v: Vect2, scalar: number): Vect2 {
        return new Vect2(v.x * scalar, v.y * scalar);
    }

    static div(v: Vect2, scalar: number): Vect2 {
        return new Vect2(v.x / scalar, v.y / scalar);
    }
}