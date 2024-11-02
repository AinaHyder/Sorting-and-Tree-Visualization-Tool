class Heap {
    constructor(isMinHeap = true) {
        this.heap = [];
        this.isMinHeap = isMinHeap; // True for Min Heap, False for Max Heap
    }

    insert(value) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
        this.drawHeap();
    }

    delete(value) {
        const index = this.heap.indexOf(value);
        if (index === -1) return; // Value not found

        this.swap(index, this.heap.length - 1);
        this.heap.pop();
        this.bubbleDown(index);
        this.drawHeap();
    }

    find(value) {
        return this.heap.includes(value);
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compare(this.heap[index], this.heap[parentIndex])) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            const leftIndex = 2 * index + 1;
            const rightIndex = 2 * index + 2;
            let largestOrSmallest = index;

            if (leftIndex < length && this.compare(this.heap[leftIndex], this.heap[largestOrSmallest])) {
                largestOrSmallest = leftIndex;
            }
            if (rightIndex < length && this.compare(this.heap[rightIndex], this.heap[largestOrSmallest])) {
                largestOrSmallest = rightIndex;
            }

            if (largestOrSmallest !== index) {
                this.swap(index, largestOrSmallest);
                index = largestOrSmallest;
            } else {
                break;
            }
        }
    }

    compare(a, b) {
        return this.isMinHeap ? a < b : a > b;
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    drawHeap() {
        const canvas = document.getElementById('heap-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const level = Math.floor(Math.log2(this.heap.length)) + 1;
        const startX = canvas.width / 2;
        const startY = 50;
        const spacing = 50;

        for (let i = 0; i < this.heap.length; i++) {
            const x = startX + (i % 2 === 0 ? -spacing : spacing) * (Math.floor(Math.log2(i + 1)));
            const y = startY + Math.floor(Math.log2(i + 1)) * 60;
            this.drawNode(ctx, this.heap[i], x, y);

            if (i > 0) {
                const parentIndex = Math.floor((i - 1) / 2);
                const parentX = startX + (parentIndex % 2 === 0 ? -spacing : spacing) * (Math.floor(Math.log2(parentIndex + 1)));
                const parentY = startY + Math.floor(Math.log2(parentIndex + 1)) * 60;
                this.drawLine(ctx, x, y, parentX, parentY);
            }
        }
    }

    drawNode(ctx, value, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#32a852";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "black";
        ctx.font = "15px Arial";
        ctx.fillText(value, x - 10, y + 5);
    }

    drawLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}

let heap;

const canvas = document.getElementById('heap-canvas');
canvas.width = 800;
canvas.height = 600;

document.getElementById('min-heap-btn').addEventListener('click', () => {
    heap = new Heap(true); // Min Heap
    initHeapControls("Min Heap Mode");
});

document.getElementById('max-heap-btn').addEventListener('click', () => {
    heap = new Heap(false); // Max Heap
    initHeapControls("Max Heap Mode");
});

function initHeapControls(mode) {
    document.getElementById('heap-type-toggle').style.display = 'none';
    document.getElementById('heap-controls').style.display = 'block';
    document.getElementById('heap-info').textContent = mode;
}

document.getElementById('insert-btn').addEventListener('click', () => {
    const value = parseInt(document.getElementById('input-value').value);
    if (!isNaN(value)) {
        heap.insert(value);
    }
});

document.getElementById('delete-btn').addEventListener('click', () => {
    const value = parseInt(document.getElementById('input-value').value);
    if (!isNaN(value)) {
        heap.delete(value);
    }
});document.getElementById('find-btn').addEventListener('click', () => {
    const value = parseInt(document.getElementById('input-value').value);
    if (!isNaN(value)) {
        const found = bst.find(value);
        alert(found ? `Value ${value} found!` : `Value ${value} not found.`);
    }
});
