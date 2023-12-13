export function getTooltipContent(node, hierarchy, unitType) {
    if (!node) return null; // Return null if node not found

    // Recursive function to sum sizes of all child nodes
    const sumChildSizes = (nodeId) => {
      let sum = 0;

      const children = hierarchy.filter((item) => item.parent === nodeId);
      for (let child of children) {
        sum += child.size || 0;
        sum += sumChildSizes(child.id); // Recursively sum child sizes
      }
      return sum;
    };

    const averageChildSizes = (nodeId, nodeSize) => { 
      // average all the children's sizes
      let sum = 0; 
      let count = 0;
      const children = hierarchy.filter((item) => item.parent === nodeId);
      for (let child of children) {
        sum += child.size || 0;
        count += 1;
      }
      if (count === 0) {
        return node.data.id + ": " + nodeSize;
      } else {
        return node.data.id + ": Composite ratio not calculated.";
      }
    }

    if (unitType === "dollars"){
      // Sum sizes recursively for all child nodes
      let sum = node.data.data.size || 0;
      sum += sumChildSizes(node.data.id);
      
      if (sum > 1000) {
        sum = (sum / 1000).toFixed(1) + "T";
      } else {
        sum = sum.toFixed(0) + "B";
      }
    
      return node.data.id + ": $" + sum;
    } else if (unitType === "ratio") {
      return averageChildSizes(node.data.id, node.data.data.size)
    }
  }