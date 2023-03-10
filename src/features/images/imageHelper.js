import Axe from './Axe.svg';
import Pick from './Pick.svg';
import Sword from './Sword.svg';

const colors = {
    'Stone': '#4A4A4A',
    'Copper': '#F5A623'
}

export const img = {
    Axe,
    Pick,
    Sword
}

export const colorChange = () => {
        if (document.getElementsByClassName('color-svg') == null) {
            console.log(document.getElementById('color-svg'));
            setTimeout(colorChange, 100);
        } else {
            let slots = document.getElementsByClassName('color-svg');
            for (let i = 0; i < slots.length; i++) {
                let item = slots[i].parentElement.firstChild.innerText;
                let svg = slots[i].contentDocument;
                let att = svg.querySelectorAll("path[fill='#fff']");
                
                for (let j = 0; j < att.length; j++) {
                    att[j].style.fill = colors[item.split(" ")[0]];
                }
                console.log(item);
                console.log(svg);
            }
        }
}