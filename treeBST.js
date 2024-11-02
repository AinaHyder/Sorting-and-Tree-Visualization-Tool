class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    delete(value) {
        this.root = this.deleteNode(this.root, value);
    }

    deleteNode(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
        } else {
            if (!node.left && !node.right) return null;
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            const minNode = this.findMinNode(node.right);
            node.value = minNode.value;
            node.right = this.deleteNode(node.right, minNode.value);
        }
        return node;
    }

    findMinNode(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    find(value) {
        return this.findNode(this.root, value);
    }

    findNode(node, value) {
        if (!node) return false;
        if (value < node.value) return this.findNode(node.left, value);
        if (value > node.value) return this.findNode(node.right, value);
        return true;
    }

    inOrder() {
        const result = [];
        this.inOrderTraverse(this.root, result);
        return result;
    }

    inOrderTraverse(node, result) {
        if (node) {
            this.inOrderTraverse(node.left, result);
            result.push(node.value);
            this.inOrderTraverse(node.right, result);
        }
    }

    preOrder() {
        const result = [];
        this.preOrderTraverse(this.root, result);
        return result;
    }

    preOrderTraverse(node, result) {
        if (node) {
            result.push(node.value);
            this.preOrderTraverse(node.left, result);
            this.preOrderTraverse(node.right, result);
        }
    }

    postOrder() {
        const result = [];
        this.postOrderTraverse(this.root, result);
        return result;
    }

    postOrderTraverse(node, result) {
        if (node) {
            this.postOrderTraverse(node.left, result);
            this.postOrderTraverse(node.right, result);
            result.push(node.value);
        }
    }

    drawTree(ctx, node, x, y, spacing) {
        if (node) {
            this.drawNode(ctx, node, x, y);
            if (node.left) {
                this.drawLine(ctx, x, y, x - spacing, y + 60);
                this.drawTree(ctx, node.left, x - spacing, y + 60, spacing / 2);
            }
            if (node.right) {
                this.drawLine(ctx, x, y, x + spacing, y + 60);
                this.drawTree(ctx, node.right, x + spacing, y + 60, spacing / 2);
            }
        }
    }

    drawNode(ctx, node, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#32a852";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "black";
        ctx.font = "15px Arial";
        ctx.fillText(node.value, x - 10, y + 5);
    }

    drawLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}

// Node class for BST
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

const canvas = document.getElementById("tree-canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const bst = new BST();

document.getElementById("insert-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("input-value").value);
    bst.insert(value);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bst.drawTree(ctx, bst.root, canvas.width / 2, 50, 150);
});

document.getElementById("delete-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("input-value").value);
    bst.delete(value);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bst.drawTree(ctx, bst.root, canvas.width / 2, 50, 150);
});
document.getElementById("find-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("input-value").value);
    const found = bst.find(value);
    alert(found ? `Value ${value} found!` : `Value ${value} not found.`);
});


document.getElementById("inorder-btn").addEventListener("click", () => {
    const result = bst.inOrder();
    document.getElementById("traversal-output").textContent = "In-Order: " + result.join(", ");
});

document.getElementById("preorder-btn").addEventListener("click", () => {
    const result = bst.preOrder();
    document.getElementById("traversal-output").textContent = "Pre-Order: " + result.join(", ");
});

document.getElementById("postorder-btn").addEventListener("click", () => {
    const result = bst.postOrder();
    document.getElementById("traversal-output").textContent = "Post-Order: " + result.join(", ");
});
