document.addEventListener('DOMContentLoaded', function() {
    
    // Your code here - executes when DOM is ready
    // const img = document.getElementById('project_1');
    // const srcValue = img.src;
    // console.log(srcValue);

    // Get all img IDs inside divs with class "xxx"
    const imgIds = [];
    const images = document.querySelectorAll('div.project img[id]');
    console.log(images);
    
    let cnt = 1;
    images.forEach(img => {
        imgIds.push(img.id);
        img.src = "img/portfolio/project_" + cnt + ".png";
        cnt ++;
    });

    console.log(imgIds);
    getContent();
});

async function getContent() {
    try {
        const response = await fetch('https://alexlinski.fwh.is/php/first.php');
        const data = await response.text();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}