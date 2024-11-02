class AVLTree {
    constructor() {
        this.root = null;
        this.animations = [];  // Store animations for step-by-step visualization
        this.speed = 1000;     // Animation delay (ms)
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        this.animations.push({ type: 'rotateRight', node: y.value });
        return x;
    }

    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        this.animations.push({ type: 'rotateLeft', node: x.value });
        return y;
    }

    insert(node, value) {
        if (!node) {
            this.animations.push({ type: 'insert', value });
            return new Node(value);
        }

        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node; // No duplicates allowed
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        const balance = this.getBalance(node);

        if (balance > 1 && value < node.left.value) {
            this.animations.push({ type: 'balance', rule: 'LL', node: node.value });
            return this.rotateRight(node);  // Left Left case
        }

        if (balance < -1 && value > node.right.value) {
            this.animations.push({ type: 'balance', rule: 'RR', node: node.value });
            return this.rotateLeft(node);   // Right Right case
        }

        if (balance > 1 && value > node.left.value) {
            this.animations.push({ type: 'balance', rule: 'LR', node: node.value });
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);  // Left Right case
        }

        if (balance < -1 && value < node.right.value) {
            this.animations.push({ type: 'balance', rule: 'RL', node: node.value });
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);   // Right Left case
        }

        return node;
    }

    delete(node, value) {
        if (!node) {
            return node;
        }

        if (value < node.value) {
            node.left = this.delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.delete(node.right, value);
        } else {
            // Node with only one child or no child
            if (!node.left || !node.right) {
                const temp = node.left ? node.left : node.right;
                if (!temp) {
                    node = null;  // No children
                } else {
                    node = temp;  // One child
                }
            } else {
                // Node with two children: Get the in-order successor
                const temp = this.getMinValueNode(node.right);
                node.value = temp.value;
                node.right = this.delete(node.right, temp.value);
            }
        }

        if (!node) {
            return node;
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        const balance = this.getBalance(node);

        // Balancing the tree after deletion
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rotateRight(node);  // Left Left case
        }

        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);  // Left Right case
        }

        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.rotateLeft(node);   // Right Right case
        }

        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);   // Right Left case
        }

        return node;
    }

    // Get the node with the minimum value in the tree (used in deletion)
    getMinValueNode(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    search(node, value) {
        if (!node) {
            console.log(`Node with value ${value} not found.`);
            return null;
        }

        if (value === node.value) {
            console.log(`Node with value ${value} found!`);
            return node;
        }

        if (value < node.value) {
            console.log(`Searching left for value ${value}`);
            return this.search(node.left, value);
        } else {
            console.log(`Searching right for value ${value}`);
            return this.search(node.right, value);
        }
    }

    drawAnimations(ctx, root) {
        const animations = this.animations;
        let index = 0;

        const interval = setInterval(() => {
            const anim = animations[index];
            if (!anim) {
                clearInterval(interval);
                this.animations = [];
                return;
            }

            if (anim.type === 'insert') {
                this.root = this.insert(this.root, anim.value);  // Insert the node
                this.drawTree(ctx, this.root);
            } else if (anim.type === 'balance') {
                this.showBalanceMessage(anim.rule, anim.node);
            } else if (anim.type === 'rotateRight') {
                this.showRotationMessage('Right', anim.node);
            } else if (anim.type === 'rotateLeft') {
                this.showRotationMessage('Left', anim.node);
            }

            index++;
        }, this.speed);
    }

    showBalanceMessage(rule, nodeValue) {
        const balanceInfo = document.getElementById('balance-info');
        balanceInfo.textContent = `Balancing at node ${nodeValue}: Rule ${rule} applied.`;
    }

    showRotationMessage(rotationType, nodeValue) {
        const balanceInfo = document.getElementById('balance-info');
        balanceInfo.textContent = `Rotating ${rotationType} at node ${nodeValue}.`;
    }

    drawNode(ctx, node, x, y, spacing) {
        if (node) {
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

            if (node.left) {
                this.drawLine(ctx, x, y, x - spacing, y + 60);
                this.drawNode(ctx, node.left, x - spacing, y + 60, spacing / 2);
            }
            if (node.right) {
                this.drawLine(ctx, x, y, x + spacing, y + 60);
                this.drawNode(ctx, node.right, x + spacing, y + 60, spacing / 2);
            }
        }
    }

    drawLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    drawTree(ctx, root) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.drawNode(ctx, root, ctx.canvas.width / 2, 50, 150);
    }
}

// Node class for AVL Tree nodes
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;  // Start with a height of 1
    }
}

const canvas = document.getElementById("tree-canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const tree = new AVLTree();

document.getElementById("insert-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("input-value").value);
    if (!isNaN(value)) {
        tree.animations = [];
        tree.root = tree.insert(tree.root, value);
        tree.drawAnimations(ctx, tree.root);
    }
});

document.getElementById("delete-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("input-value").value);
    if (!isNaN(value)) {
        tree.root = tree.delete(tree.root, value);
        tree.drawTree(ctx, tree.root);
    }
});

document.getElementById("search-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("input-value").value);
    if (!isNaN(value)) {
        tree.search(tree.root, value);
    }
});
