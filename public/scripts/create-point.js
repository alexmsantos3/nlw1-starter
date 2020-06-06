
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome") /*Troquei o link a seguir por um ordenado alfabeticamente("https://servicodados.ibge.gov.br/api/v1/localidades/estados")*/
    .then(res => res.json()) /*(res) => {return res.json()}*/
    .then(states => {
        for(const state of states) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })
}
populateUFs()


function getCities() {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value    

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios?orderBy=nome`
    //Troquei o link a seguir por um ordenado alfabeticamente https://servicodados.ibge.gov.br/api/v1/localidades/estados/33/municipios

    citySelect.innerHTML = `<option value="">Selecione a Cidade</option>`
    citySelect.disabled = true

    fetch(url).then(res => res.json()).then(cities => {
        for(const city of cities) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        //Criei uma validação para habilitar o campo de cidade
        if(ufValue != "") {
            citySelect.disabled = false
        }
        //citySelect.disabled = false
    })
}

document.querySelector("select[name=uf]")
.addEventListener("change", getCities)


// Itens de coleta
// Pegar todos os li`s
const itemsToCollect = document.querySelectorAll(".items-grid li")
for(const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")
let selectedItems = [] //Array que recebera as seleções

function handleSelectedItem(event) {
    const itemLi = event.target

    //Adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    //console.log("ITEM ID: ", itemId)

    //Verificar se existem itens selecionados, se sim 
    //pegar os itens selecionados
    //alreadySelected = jáSelecionado
    const alreadySelected = selectedItems.findIndex(item => {
        const itemFound = item == itemId //isso será true ou false
        return itemFound
    })

    //se já estiver selecionado
    if(alreadySelected >= 0) {
        //tirar da seleção
        const filteredItems = selectedItems.filter(item => {
            const itemsIsDifferent = item != itemId
            return itemsIsDifferent
        })

        selectedItems = filteredItems
    } else {
        //se não estiver selecionado
        //adicionar à seleção
        selectedItems.push(itemId)
    }

    //console.log("ITEM SELECIONADO: ", selectedItems)

    //atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}
