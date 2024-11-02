function bubbleSort(arr) {
    let swapped;
    do {
        swapped = false;
        for (let j = 0; j < arr.length - 1; j++) {
            if (compare(arr, j, j + 1)) {
                swap(arr, j, j + 1);
                swapped = true;
            }
        }
    } while (swapped);
}

function insertionSort(arr) {
    // Loop through the array starting from the second element
    for (let i = 1; i < arr.length; i++) {
        let j = i;
        // Move elements that are greater than the current element one step ahead
        while (j > 0 && compare(arr, j - 1, j)) {
            // Swap the elements
            swap(arr, j - 1, j);
            j--;
        }
    }
}



function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (compare(arr, minIdx, j)) {
                minIdx = j;
            }
        }
        swap(arr, i, minIdx);
    }
}

function quickSort(arr) {
    _quickSortLomuto(arr, 0, arr.length - 1);
}

function _quickSortLomuto(arr, left, right) {
    if (left >= right) return;
    let pivotIdx = partition(arr, left, right);
    _quickSortLomuto(arr, left, pivotIdx - 1);
    _quickSortLomuto(arr, pivotIdx + 1, right);
}

function partition(arr, left, right) {
    let pivot = arr[right].val;
    let i = left - 1;
    for (let j = left; j < right; j++) {
        if (arr[j].val < pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, right);
    return i + 1;
}

function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const middle = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, middle));
    const right = mergeSort(arr.slice(middle));
    return merge(left, right);
}

function merge(left, right) {
    const resultArray = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].val < right[rightIndex].val) {
            resultArray.push(left[leftIndex]);
            leftIndex++;
        } else {
            resultArray.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Helper functions
// function swap(arr, x, y) {
//     const temp = arr[x];
//     arr[x] = arr[y];
//     arr[y] = temp;
// }

function swap(arr, x, y) {
    const temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
    drawArray(arr);  // Update the visualization immediately after the swap
}


function compare(arr, x, y) {
    return arr[x].val > arr[y].val;
}


document.getElementById('bubbleSort').addEventListener('click', function(e) {
    e.preventDefault();  // Stop the default behavior of links (reloading page)
    handleAlgorithmSelection('Bubble Sort');
});

document.getElementById('selectionSort').addEventListener('click', function(e) {
    e.preventDefault();
    handleAlgorithmSelection('Selection Sort');
});

document.getElementById('mergeSort').addEventListener('click', function(e) {
    e.preventDefault();
    handleAlgorithmSelection('Merge Sort');
});

document.getElementById('quickSort').addEventListener('click', function(e) {
    e.preventDefault();
    handleAlgorithmSelection('Quick Sort');
});
document.getElementById('insertionSort').addEventListener('click', function(e) {
    e.preventDefault();
    handleAlgorithmSelection('Insertion Sort');
});
