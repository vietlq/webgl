// Vertices & Shaders (GLSL)
// https://material.google.com/style/color.html#color-color-palette

var gl, shaderProgram, vertices, angle = 0;
var DIMENSIONS = 3;

initGL();
createShaders();
createVertices();
draw();

// OpenGL matrices are in column-major order
// When doing math, remember to transpose the following matrices
/*
ROT_X_MAT = [
    1,    0,   0, 0,
    0,  cos, sin, 0,
    0, -sin, cos, 0,
    0,    0,   0, 1
];

ROT_Y_MAT = [
    cos, 0, -sin, 0,
      0, 1,    0, 0,
    sin, 0,  cos, 0,
      0, 0,    0, 1
];

ROT_Z_MAT = [
     cos, sin, 0, 0,
    -sin, cos, 0, 0,
       0, 0,   1, 0,
       0, 0,   0, 1
];

SCALE_MAT = [
    Sx,  0,  0, 0,
     0, Sy,  0, 0,
     0,  0, Sz, 0,
     0,  0,  0, 1
];

TRANS_MAT = [
     1,  0,  0, 0,
     0,  1,  0, 0,
     0,  0,  1, 0,
    Tx, Ty, Tz, 1
];
*/

function rotateX(angle) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle),
        matrix = new Float32Array([
            1,    0,   0, 0,
            0,  cos, sin, 0,
            0, -sin, cos, 0,
            0,    0,   0, 1
        ]);
    var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    // The 2nd param is boolean that asks whether we want to transpose the matrix
    // However it does not do anythingin WebGL, so we have to transpose matrices ourselves
    gl.uniformMatrix4fv(transformMatrix, false, matrix);
}

function rotateY(angle) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle),
        matrix = new Float32Array([
            cos, 0, -sin, 0,
              0, 1,    0, 0,
            sin, 0,  cos, 0,
              0, 0,    0, 1
        ]);
    var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    // The 2nd param is boolean that asks whether we want to transpose the matrix
    // However it does not do anythingin WebGL, so we have to transpose matrices ourselves
    gl.uniformMatrix4fv(transformMatrix, false, matrix);
}

function rotateZ(angle) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle),
        matrix = new Float32Array([
             cos, sin, 0, 0,
            -sin, cos, 0, 0,
               0, 0,   1, 0,
               0, 0,   0, 1
        ]);
    var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    // The 2nd param is boolean that asks whether we want to transpose the matrix
    // However it does not do anythingin WebGL, so we have to transpose matrices ourselves
    gl.uniformMatrix4fv(transformMatrix, false, matrix);
}

function scale(Sx, Sy, Sz) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle),
        matrix = new Float32Array([
            Sx,  0,  0, 0,
             0, Sy,  0, 0,
             0,  0, Sz, 0,
             0,  0,  0, 1
        ]);
    var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    // The 2nd param is boolean that asks whether we want to transpose the matrix
    // However it does not do anythingin WebGL, so we have to transpose matrices ourselves
    gl.uniformMatrix4fv(transformMatrix, false, matrix);
}

function translate(Tx, Ty, Tz) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle),
        matrix = new Float32Array([
             1,  0,  0, 0,
             0,  1,  0, 0,
             0,  0,  1, 0,
            Tx, Ty, Tz, 1
        ]);
    var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    // The 2nd param is boolean that asks whether we want to transpose the matrix
    // However it does not do anythingin WebGL, so we have to transpose matrices ourselves
    gl.uniformMatrix4fv(transformMatrix, false, matrix);
}

function mapOrdinate(value, minSrc, maxSrc, minDst, maxDst) {
    return (value - minSrc) / (maxSrc - minSrc) * (maxDst - minDst) + minDst;
}

function initGL() {
    var canvas = document.getElementById("canvas");

    // Add canvas event listener
    canvas.addEventListener('mousemove', function() {
        // For X the direction in WebGL from -1 to 1 is the same as for the screen
        mouseX = mapOrdinate(event.clientX, 0, canvas.width, -1, 1);
        // For Y the direction in WebGL from -1 to 1 is reversed compared to the screen
        mouseY = mapOrdinate(event.clientY, 0, canvas.height, 1, -1);
    });

    gl = canvas.getContext("webgl");
    //gl = canvas.getContext("experimental-webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    // RGBA (0 -> 1)
    gl.clearColor(0.1, 0.6, 0.9, 1);
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
function getShader(gl, id, type) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (! shaderScript) {
        return null;
    }

    theSource = shaderScript.text;
    if (!type) {
        if (shaderScript.type == "x-shader/x-fragment") {
            type = gl.FRAGMENT_SHADER;
        } else if (shaderScript.type == "x-shader/x-vertex") {
            type = gl.VERTEX_SHADER;
        } else {
            // Unknown shader type
            return null;
        }
    }

    shader = gl.createShader(type);
    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createShaders() {
    // Vertex Shader
    var vertexShader = getShader(gl, "shader-vs");
    // Fragment Shader
    var fragmentShader = getShader(gl, "shader-fs");

    // Create Shader Program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}

function createVertices() {
    vertices = [
         0.0,  0.8, 0.0,
         0.8, -0.8, 0.0,
        -0.8, -0.8, 0.0,
    ];

    var buffer = gl.createBuffer();
    // Array buffer because vertices is an array
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.STATIC_DRAW meant for rarely changed drawing
    // gl.DYNAMIC_DRAW is efficient for frequently changed drawing
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    var coords = gl.getAttribLocation(shaderProgram, "coords");
    //gl.vertexAttrib3f(coords, 0, .5, 0);
    // We will pass a pointer whose elements are organised in block of DIMENSIONS floats
    gl.vertexAttribPointer(coords, DIMENSIONS, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coords);
    // Always unbind the buffer. Unbiding omitted only for naive implementation
    //gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
    gl.vertexAttrib1f(pointSize, 2);

    var color = gl.getUniformLocation(shaderProgram, "color");
    gl.uniform4f(color, 1, 1, 0, 1);
}

function draw() {
    angle += 0.01;

    //rotateX(angle);
    rotateY(angle);
    //rotateZ(angle);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Offset, number of vertices
    //gl.drawArrays(gl.POINTS, 0, 1);

    // Now we have 3 points
    // The 2nd param is the start index (offset) of the array to draw
    // The 3rd param is the number of points from the start index to draw
    //gl.drawArrays(gl.POINTS, 0, 4);

    // Now we have 2 lines joining 1st-2nd 3rd-4th (pairwise only)
    //gl.drawArrays(gl.LINES, 0, 4);

    // Now we have lines joining all points 1-2-3-4
    //gl.drawArrays(gl.LINE_STRIP, 2, 4);

    // Now we have a loop of lines joining all points 1-2-3-4-1
    //gl.drawArrays(gl.LINE_LOOP, 6, 4);

    // Draw triangles for sequential groups of 3 points and fill
    // The remaining 1 or 2 points will have no connection
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Request to redraw again and again, thus creating an animation
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    window.requestAnimationFrame(draw);
}
