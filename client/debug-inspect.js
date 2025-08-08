// Debug script to inspect header width constraints
console.log('=== HEADER WIDTH DEBUG ===');

// Find the header element
const header = document.querySelector('.full-width-header');
if (header) {
    console.log('Header element found');
    console.log('Header computed width:', window.getComputedStyle(header).width);
    console.log('Header computed max-width:', window.getComputedStyle(header).maxWidth);
    console.log('Header computed position:', window.getComputedStyle(header).position);
    
    // Check all parent elements for width constraints
    let parent = header.parentElement;
    let level = 1;
    while (parent && level <= 5) {
        const styles = window.getComputedStyle(parent);
        console.log(`Parent level ${level}:`, {
            tagName: parent.tagName,
            className: parent.className,
            width: styles.width,
            maxWidth: styles.maxWidth,
            overflow: styles.overflow,
            overflowX: styles.overflowX
        });
        parent = parent.parentElement;
        level++;
    }
    
    // Check viewport width
    console.log('Viewport width:', window.innerWidth);
    console.log('Document body width:', document.body.offsetWidth);
    
} else {
    console.log('Header element not found!');
}