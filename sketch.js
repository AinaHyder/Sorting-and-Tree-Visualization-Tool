// Constants and Globals
var arr = [];
const width = window.innerWidth;
const height = window.innerHeight-80;
var thick = 20;
var len_arr = Math.floor(width / thick);
var sorted_arr = [];
var start_sorting = false;
var frame_rate_val = 40;
var timer_arr = [];
var time_taken = 0;
var pause = false;

// Element class to define each bar in the array
class Element {
    constructor(val) {
        this.val = val;
        this.compare = false;
        this.swap = false;
    }

    draw(i, color = 255) {
        fill(color);
        if (this.compare) {
            fill(0, 0, 255); // Blue when comparing
        }
        if (this.swap) {
            fill(255, 0, 0); // Red when swapping
        }
        stroke(0);
        rect(i * thick, height - this.val + 1, thick, this.val);
        this.swap = false;
        this.compare = false; // Reset after drawing
    }
}

// Algorithm function map
const algo_dict = {
    bubbleSort: bubbleSort,
    selectionSort: selectionSort,
    mergeSort: mergeSort,
    quickSort: quickSort,
    insertionSort: insertionSort,
};

// Timer function map
const timer_algo = {
    bubbleSort: bubbleSort_t,
    selectionSort: selectionSort_t,
    mergeSort: mergeSort_t,
    quickSort: quickSortLomuto_t,
    insertionSort: insertionSort_t,
};

// Setup function for the canvas and event listeners
function setup_arr() {
    arr = [];  // Reset the array
    sorted_arr = [];
    timer_arr = [];

    for (let i = 0; i < len_arr; i++) {
        let push_value = random(thick, height - thick);
        arr.push(new Element(push_value));  // Add new elements to the array
        sorted_arr.push(push_value);  // Copy to sorted array
        timer_arr.push(new Element(push_value));  // For timing algorithms
    }

    sort_the_arr(sorted_arr);  // Sort the array to compare later
    background(0);  // Clear the background with black
    draw_arr();  // Immediately draw the array after setup
}



function handleAlgorithms(algorithmId) {
    if (!start_sorting) {
        start_sorting = true;
        start_sort(algorithmId);
        time_this_algo(algorithmId);
        frameRate(frame_rate_val);
    } else {
        // Reset before starting another sorting algorithm
        reset_arr();
        start_sorting = true;
        time_this_algo(algorithmId);
        start_sort(algorithmId);
    }
}


// Adjusted reset handling in button click event
function setup() {
    print_hello();
    createCanvas(width, height);

    let btns = document.querySelectorAll(".clickable");
    for (let btn of btns) {
        btn.addEventListener("click", function () {
            if (this.id == "reset") {
                // Reset the sorting process
                reset_arr();
            } else if (this.id != "") {
                // Start sorting if a sorting algorithm is selected
                if (!start_sorting) {
                    start_sorting = true;
                    start_sort(this.id);
                    time_this_algo(this.id);
                    frameRate(frame_rate_val);
                } else {
                    // Reset before starting another sorting algorithm
                    reset_arr();
                    start_sorting = true;
                    time_this_algo(this.id);
                    start_sort(this.id);
                }
            }
            return true;
        });
    }

    slider_control();  // Setup sliders
    setup_arr();  // Initialize and draw the array on load
}

// Draw the array elements
function draw_arr() {
    background(0);  // Clear the background
    for (let i = 0; i < arr.length; i++) {
        arr[i].draw(i);  // Draw each element
        if (sorted_arr[i] === arr[i].val) {
            arr[i].draw(i, color(0, 255, 0));  // Draw green if sorted
        }
    }
}

// Function to reset the array
function reset_arr() {
    arr = [];
    sorted_arr = [];
    start_sorting = false;
    frameRate(frame_rate_val);
    setup_arr();
    document.getElementById("time").innerHTML = "Time: 0us";
    document.getElementById("frm").value = "40";
}

// Function to start sorting using the selected algorithm
function start_sort(algo) {
    loop_counter = algo_dict[algo](arr);
    start_sorting = true;
}

// Main draw function that runs on the canvas
function draw() {
    if (start_sorting) {
        loop_counter.next(); // Execute the next step of sorting
    }
    draw_arr();
}

// Timer function to calculate and display the time taken by the algorithm
function time_this_algo(algo) {
    var t0 = window.performance.now();
    timer_algo[algo](timer_arr);
    var t1 = window.performance.now();
    let time = (t1 - t0) * 1000;
    time = Math.round(time);
    if (time < 1000) {
        document.getElementById("time").innerHTML = "Time: " + time + "us";
    } else {
        document.getElementById("time").innerHTML = "Time: " + Math.round(time / 1000) + "ms";
    }
}

// Slider control for adjusting size and frame rate
function slider_control() {
    var size_slider = document.getElementById("data_size");
    size_slider.oninput = function () {
        thick = 62 - size_slider.value;
        len_arr = Math.floor(width / thick);
        reset_arr();
    };

    var frm_slider = document.getElementById("frm");
    frm_slider.oninput = function () {
        frame_rate_val = this.value;
        frameRate(frame_rate_val);
    };
}

// Sorting algorithms (bubbleSort, selectionSort, etc.) should be implemented here

// Example bubble sort generator function
function* bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            arr[j].compare = true;
            arr[j + 1].compare = true;
            yield;
            if (arr[j].val > arr[j + 1].val) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                arr[j].swap = true;
                arr[j + 1].swap = true;
            }
            yield;
        }
    }
    start_sorting = false;
}

function* selectionSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < len; j++) {
            arr[j].compare = true;
            arr[minIdx].compare = true;
            if (arr[j].val < arr[minIdx].val) {
                minIdx = j;
            }
            yield;
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            arr[i].swap = true;
            arr[minIdx].swap = true;
        }
        yield;
    }
    start_sorting = false;
}

function* insertionSort(arr) {
    let len = arr.length;
    for (let i = 1; i < len; i++) {
        let key = new Element(arr[i].val);  // Create a shallow copy of the current element
        let j = i - 1;

        // Compare and shift elements of the sorted part
        while (j >= 0 && arr[j].val > key.val) {
            arr[j].compare = true;  // Mark as comparing
            arr[j + 1] = arr[j];  // Shift element to the right
            yield;  // Yield control for visualization
            j--;
        }
        
        arr[j + 1] = key;  // Insert the key in the correct position
        arr[j + 1].swap = true;  // Mark the insertion as a swap
        
        yield;  // Yield control for visualization
    }

    start_sorting = false;  // Mark sorting as finished
}


function* mergeSort(arr, start = 0, end = arr.length) {
    if (end - start > 1) {
        const mid = Math.floor((start + end) / 2);
        yield* mergeSort(arr, start, mid);
        yield* mergeSort(arr, mid, end);
        yield* merge(arr, start, mid, end);
    }
}

function* merge(arr, start, mid, end) {
    let left = arr.slice(start, mid);
    let right = arr.slice(mid, end);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        left[i].compare = true;
        right[j].compare = true;
        if (left[i].val <= right[j].val) {
            arr[k] = left[i];
            arr[k].swap = true;
            i++;
        } else {
            arr[k] = right[j];
            arr[k].swap = true;
            j++;
        }
        k++;
        yield;
    }

    while (i < left.length) {
        arr[k] = left[i];
        arr[k].swap = true;
        i++;
        k++;
        yield;
    }

    while (j < right.length) {
        arr[k] = right[j];
        arr[k].swap = true;
        j++;
        k++;
        yield;
    }
}


function* quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pi = yield* partition(arr, low, high);
        yield* quickSort(arr, low, pi - 1);
        yield* quickSort(arr, pi + 1, high);
    }
}

function* partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        arr[j].compare = true;
        pivot.compare = true;
        if (arr[j].val < pivot.val) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            arr[i].swap = true;
            arr[j].swap = true;
        }
        yield;
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    arr[i + 1].swap = true;
    arr[high].swap = true;
    yield;
    return i + 1;
}


// Example of sorting array (used for final state comparison)
function sort_the_arr(arr) {
    arr.sort((a, b) => a - b);  // Use built-in sort for final state comparison
}

function print_hello() {
    console.log('Hellooo human!');
}
