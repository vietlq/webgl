// Vertices & Shaders (GLSL)
// https://material.google.com/style/color.html#color-color-palette

var gl, shaderProgram, vertices;
var DIMENSIONS = 2, VERTEX_COUNT = 5000;

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
    vertices = [];
    // Generate coordinates for vertices
    for (var i = 0; i < VERTEX_COUNT; ++i) {
        vertices.push(Math.random() * 2 - 1);
        vertices.push(Math.random() * 2 - 1);
    }

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
    for (var i = 0; i < VERTEX_COUNT; ++i) {
        vertices[2*i] += Math.random() * 0.01 - 0.005;
        vertices[2*i + 1] += Math.random() * 0.01 - 0.005;
    }
    // gl.bufferSubData allows updating a subset of data when needed
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices));

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Offset, number of vertices
    //gl.drawArrays(gl.POINTS, 0, 1);

    // Now we have 3 points
    // The 2nd param is the start index (offset) of the array to draw
    // The 3rd param is the number of points from the start index to draw
    //gl.drawArrays(gl.POINTS, 0, 4);
    gl.drawArrays(gl.POINTS, 0, VERTEX_COUNT);

    // Now we have 2 lines joining 1st-2nd 3rd-4th (pairwise only)
    //gl.drawArrays(gl.LINES, 0, 4);

    // Now we have lines joining all points 1-2-3-4
    //gl.drawArrays(gl.LINE_STRIP, 2, 4);

    // Now we have a loop of lines joining all points 1-2-3-4-1
    //gl.drawArrays(gl.LINE_LOOP, 6, 4);

    // Draw triangles for sequential groups of 3 points and fill
    // The remaining 1 or 2 points will have no connection
    //gl.drawArrays(gl.TRIANGLES, 0, 4);

    // Request to redraw again and again, thus creating an animation
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    window.requestAnimationFrame(draw);
}
