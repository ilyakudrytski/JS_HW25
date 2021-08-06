window.addEventListener('DOMContentLoaded', () => {
    let hash = window.location.hash.substr(1);
    const wrapper = document.getElementById('wrapper');
    showPage();

    window.addEventListener("hashchange", () => {
        hash = window.location.hash.substr(1);
        showPage();
    });



    function showPage() {
        switch (hash.substr(0, 4)) {
            case 'tabl':
                getNsetPage('table');
                getNsetJSONFile('table');
                break;

            case 'info':
                getNsetPage('info');
                getNsetJSONFile('navi');
                break;

            case 'main':
            default:
                getNsetPage('main');
        }
    }

    async function getNsetPage(title) { // перезагрузка страницы, подгрузка актуального файла
        const resp = await fetch(`pages/${title}.html`)
        const data = await resp.text();
        console.log(data)
        wrapper.innerHTML = data;
    }

    async function getNsetJSONFile(mode) { // загрузка файла со списком статей и использование по одному из трех сценариев, в зависимости от ситуации
        const resp = await fetch('info/info.json')
        const data = await resp.json();

        switch (mode.substr(0, 4)) {
            case 'tabl':
                const content = document.getElementById('content');
                setTableContent(Object.keys(data), content);
                break;
            case 'navi':
                const links = document.getElementById('links');
                setNavContent(Object.keys(data), links);
            case 'info':
                let length = hash.substr(4, hash.length);
                let counter = 0;
                for (let i in data) {
                    if (counter != length) {
                        counter++
                    } else {
                        setInfoContent(data[i], i);
                        break;
                    }
                }
        }

    }

    function setTableContent(obj, container) { // создание оглавления на соотвествующей странице
        let letter = obj[0].substr(0, 1);
        console.log(letter)
        for (let i = 0; i < obj.length; i++) {
            let divEl = document.createElement('div');
            let h2El = document.createElement('h2');
            h2El.textContent = letter;
            console.log(h2El)
            divEl.appendChild(h2El);
            console.log(divEl)
            while (letter === obj[i].substr(0, 1)) {
                let aEl = document.createElement('a');
                aEl.textContent = obj[i];
                aEl.setAttribute('href', '#info' + i);
                divEl.appendChild(aEl);
                i++;
                if (i === obj.length) break;
            }
            container.appendChild(divEl);
            if (i === obj.length) break;
            letter = obj[i].substr(0, 1);
            i--;

        }
    }

    function setNavContent(obj, container) { // создание списка статей в левом сайдбаре
        for (let i = 0; i < obj.length; i++) {
            let navigationEl = document.createElement('a');
            navigationEl.textContent = obj[i];
            navigationEl.setAttribute('href', '#info' + i);
            container.appendChild(navigationEl);
        }
    }

    async function setInfoContent(filename, name) { // создание статьи из файла
        const contentEl = document.getElementById('info');
        let resp = await fetch(`info/${filename}`)
        let data = await resp.text();
        let content = `
        <h2>${name}</h2>
        <p>${data}</p>
        `;
        contentEl.innerHTML = content;
    }
});