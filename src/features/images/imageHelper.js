import Axe from './Axe.svg';
import Pick from './Pick.svg';
import Sword from './Sword.svg';
import Knife from './Knife.svg';
import Scimitar from './Scimitar.svg';
import Ore from './Ore.svg';
import Bar from './Bar.svg';
import Bones from './Bones.svg';
import Feathers from './Feathers.svg';
import Log from './Log.svg';
import Plank from './Plank.svg';
import Rod from './Rod.svg';
import Hide from './Hide.svg';
import Leather from './Leather.svg';
import Helm from './Helm.svg';
import Chest from './Chest.svg';
import Gloves from './Gloves.svg';
import Legs from './Legs.svg';
import Boots from './Boots.svg';
import Shield from './Shield.svg';
import Chicken from './Chicken.svg';
import Beef from './Meat.svg';
import Venison from './Meat.svg';
import Boar from './Meat.svg';
import Bear from './Meat.svg';
import Croc from './Meat.svg';
import Grizzly from './Meat.svg';
import Scale from './Scale.svg';

const colors = {
    Training: '#fff',
    Stone: '#2A2A2A',
    Copper: '#F5A623',
    Tin: '#638DA5',
    Bronze: '#8B4E18',
    Iron: '#4A4A4A',
    Coal: '#2D3B1E',
    Steel: '#8C8CB0',
    Alumite: '#FC88FC',
    Bone: '#FFF2DC',
    Dragon: '#72010E',
    Normal: '#8B4E18',
    Oak: '#E79148',
    Willow: '#778D5E',
    Teak: '#FAD496',
    Maple: '#BB5803',
    Yew: '#2F2217',
    Cow: '#C9C9C9',
    Stag: '#8B572A',
    Boar: '#9E3E1C',
    Bear: '#282525',
    Croc: '#436717',
    Grizzly: '#8B7866',
    Raw1: '#FDCED4',
    Raw: '#9E0404',
    Cooked: '#704602'
}

export const img = {
    Axe,
    Pick,
    Sword,
    Knife,
    Scimitar,
    Ore,
    Bar,
    Bones,
    Feathers,
    Log,
    Plank,
    Rod,
    Hide,
    Leather,
    Helm,
    Chest,
    Gloves,
    Legs,
    Boots,
    Shield,
    Chicken,
    Beef,
    Venison,
    Boar,
    Bear,
    Croc,
    Grizzly,
    Scale
}

export const colorChange = () => {
    if (document.getElementsByClassName('color-svg').length > 0) {
        let slots = document.getElementsByClassName('color-svg');
        for (let i = 0; i < slots.length; i++) {
            let item = slots[i].parentElement.firstChild.innerText;
            let svg = slots[i].contentDocument;
            let att = svg.querySelectorAll("path[fill='#fff']");
            if (item === 'Normal Bones' || item === 'Normal Feathers') {
                item = 'Bone Bones'
            }
            if (item === 'Raw Chicken') {
                item = 'Raw1 Chicken'
            }
            for (let j = 0; j < att.length; j++) {
                att[j].style.fill = colors[item.split(" ")[0]];
            }
        }
    } else {
        //setTimeout(colorChange, 10)
    }
}

export const loadSelect = event => {
    let item = event.parentElement.firstChild.innerText;
    let svg = event.contentDocument;
    let att = svg.querySelectorAll("path[fill='#fff']");
    if (item === 'Normal Bones' || item === 'Normal Feathers') {
        item = 'Bone Bones'
    }
    if (item === 'Raw Chicken') {
        item = 'Raw1 Chicken'
    }
    for (let j = 0; j < att.length; j++) {
        att[j].style.fill = colors[item.split(" ")[0]];
    }
}

const checkColor = () => {
    let list1, list2, check, last;
    list1 = document.getElementsByClassName('color-svg')
    list2 = document.getElementsByClassName('second')
    check = list1[0].contentDocument;
    if (list2.length > 0) {
        //console.log(list2)
        last = list2[0].contentDocument;
    }

    console.log(last)
    if (check.querySelectorAll("path[style]").length < 1) {
        console.log('color change')
        setTimeout(colorChange, 10);
    } else if (last) {
        console.log(last.querySelectorAll("path[fill='#fff']"))
        if (last.querySelectorAll("path[fill='#fff']").length < 1) {
            console.log('color change2')
            setTimeout(colorChange, 10);
        } else {
            console.log('else');
        }
    }
    console.log('done')
}