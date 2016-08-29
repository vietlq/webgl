// Vertices & Shaders (GLSL)
// https://material.google.com/style/color.html#color-color-palette

var gl, shaderProgram;

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
    fs += "void main(void) {";
    fs += "    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);";
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
    var coords = gl.getAttribLocation(shaderProgram, "coords");
    gl.vertexAttrib3f(coords, 0, .5, 0);

    var pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
    gl.vertexAttrib1f(pointSize, 30);
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Offset, number of vertices
    gl.drawArrays(gl.POINTS, 0, 1);
}
