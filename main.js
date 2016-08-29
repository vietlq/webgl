// Vertices & Shaders (GLSL)
// https://material.google.com/style/color.html#color-color-palette

var gl, shaderProgram, vertices;

initGL();
createShaders();
createVertices();
draw();

function initGL() {
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");
    //gl = canvas.getContext("experimental-webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    // RGBA (0 -> 1)
    gl.clearColor(0.1, 0.6, 0.9, 1);
}

function createShaders() {
    // Vertex Shader Source
    var vs = "";
    vs += "attribute vec4 coords;"
    vs += "attribute float pointSize;"
    vs += "void main(void) {";
    vs += "    gl_Position = coords;";
    vs += "    gl_PointSize = pointSize;";
    vs += "}";
    // Compile Vertex Shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vs);
    gl.compileShader(vertexShader);

    // Fragment Shader Source
    var fs = "";
    fs += "precision mediump float;"
    fs += "uniform vec4 color;"
    fs += "void main(void) {";
    fs += "    gl_FragColor = color;";
    fs += "}";
    // Compile Fragment Shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fs);
    gl.compileShader(fragmentShader);

    // Create Shader Program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}

function createVertices() {
    // Each vertex has coordinates (x, y, z)
    vertices = [
        -0.8, -0.8, 0.0,
         0.8, -0.8, 0.0,
         0.0,  0.8, 0.0,
         0.4,  0.4, 0.0
    ];

    var buffer = gl.createBuffer();
    // Array buffer because vertices is an array
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var coords = gl.getAttribLocation(shaderProgram, "coords");
    //gl.vertexAttrib3f(coords, 0, .5, 0);
    // We will pass a pointer whose elements are organised in block of 3 floats
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coords);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
    gl.vertexAttrib1f(pointSize, 30);

    var color = gl.getUniformLocation(shaderProgram, "color");
    gl.uniform4f(color, 1, 1, 0, 1);
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Offset, number of vertices
    //gl.drawArrays(gl.POINTS, 0, 1);

    // Now we have 3 points
    // The 2nd param is the start index (offset) of the array to draw
    // The 3rd param is the number of points from the start index to draw
    gl.drawArrays(gl.POINTS, 0, 4);

    // Now we have 2 lines joining 1st-2nd 3rd-4th (pairwise only)
    //gl.drawArrays(gl.LINES, 0, 4);

    // Now we have lines joining all points 1-2-3-4
    //gl.drawArrays(gl.LINE_STRIP, 0, 4);

    // Now we have a loop of lines joining all points 1-2-3-4-1
    //gl.drawArrays(gl.LINE_LOOP, 0, 4);

    // Draw triangles for sequential groups of 3 points and fill
    // The remaining 1 or 2 points will have no connection
    gl.drawArrays(gl.TRIANGLES, 0, 4);
}
