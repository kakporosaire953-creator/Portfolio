/**
 * THE KRAFTER, monogram geometry.
 *
 * These polygons are traced from the official `public/brand/the-krafter-mark.png`
 * (marching-squares pass on the mark, then Ramer-Douglas-Peucker). They are not a
 * redesign: the traced fill matches the file to within 1 %, which is the
 * anti-aliased edge. The loader extrudes these loops in Three.js, so the real
 * mark is what assembles on screen.
 *
 * Coordinates: x in [-1, 1] relative to the mark height, +y up, centred on 0.
 */
export const MARK_LOOPS: [number, number][][] = [
  [
    [-0.793, 0.8828],
    [-0.1445, 0.8828],
    [-0.1445, 0.5977],
    [-0.2891, 0.5859],
    [-0.3438, 0.5586],
    [-0.375, 0.2188],
    [-0.5039, 0.0391],
    [-0.3008, 0.2344],
    [0.2539, 0.8828],
    [0.6992, 0.8828],
    [0.6992, 0.8711],
    [0.5742, 0.7461],
    [0.4609, 0.6641],
    [0.4102, 0.6055],
    [0.3711, 0.5859],
    [-0.0273, 0.2344],
    [-0.0391, 0.2383],
    [-0.3125, -0.0117],
    [-0.3516, -0.0312],
    [-0.4766, -0.1562],
    [-0.625, -0.2734],
    [-0.6367, -0.3008],
    [-0.6914, -0.332],
    [-0.7227, -0.375],
    [-0.7422, -0.375],
    [-0.7383, 0.5898],
    [-0.8008, 0.5977],
    [-0.8047, 0.8672],
  ],
  [
    [0.793, 0.7852],
    [0.8008, 0.6992],
    [0.1328, 0.0117],
    [0.793, -0.7461],
    [0.8008, -0.8867],
    [0.3555, -0.8867],
    [-0.1328, -0.2773],
    [-0.1992, -0.332],
    [-0.1875, -0.3477],
    [-0.2539, -0.4258],
    [-0.2578, -0.875],
    [-0.7812, -0.8828],
    [-0.7344, -0.6172],
    [-0.7344, -0.4805],
    [-0.7188, -0.4609],
    [-0.0938, 0.0391],
    [0.0508, 0.1719],
    [0.1641, 0.25],
  ],
];
