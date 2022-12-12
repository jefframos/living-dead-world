import * as PIXI from 'pixi.js';

import ListScroller from '../../ui/uiElements/ListScroller';
import Signals from 'signals';

export default class ShopList extends ListScroller
{
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 5)
    {
        super(rect, itensPerPage, true);
        this.onItemShop = new Signals();
        this.onShowInfo = new Signals();
        this.onVideoItemShop = new Signals();
        this.onShowBlock = new Signals();
        // this.onShopItem = new Signals();
        this.container = new PIXI.Container();
        this.itens = [];

    }
    addBaseGradient(texture, width, color){
        this.extraHeight = 30
        this.baseGradient = new PIXI.Sprite.from(texture);
        this.baseGradient.tint = color;
        this.baseGradient.width = width;
        this.baseGradient.height = this.extraHeight;
        this.baseGradient.anchor.set(0,1);
        this.baseGradient.y = this.rect.h + 2
        this.addChild(this.baseGradient)
    }
    addItens(itens)
    {
        for (var i = 0; i < itens.length; i++)
        {
            let tempItem = itens[i];
            this.listContainer.addChild(tempItem)
            tempItem.y = this.itemHeight * this.itens.length - 1;
            if (tempItem.onConfirmShop)
            {
                tempItem.onConfirmShop.add(this.onShopItemCallback.bind(this));
                tempItem.onShowInfo.add(this.onShowInfoCallback.bind(this));
                tempItem.onShowBlock.add(this.onShowBlockCallback.bind(this));
            }
            this.itens.push(tempItem);

        }
        this.lastItemClicked = this.itens[0]
    }
    onShowBlockCallback(itemData, button)
    {
        this.onShowBlock.dispatch(itemData, button);
    }
    onShowInfoCallback(itemData, button)
    {
        this.onShowInfo.dispatch(itemData, button);
    }
    onShopItemCallback(itemData, realCost, button, totalUpgrades)
    {
        // let staticData = GAME_DATA[itemData.staticData][itemData.id];
        // if (staticData.shopType == 'video')
        // {
        //     this.onVideoItemShop.dispatch(itemData);
        //     return
        // }
        // GAME_DATA.buyUpgrade(itemData, realCost);

        itemData.upgrade(totalUpgrades)
        this.onItemShop.dispatch(itemData, button, totalUpgrades);
        this.updateItems();
    }
    hide()
    {
        for (var i = 0; i < this.itens.length; i++)
        {
            this.itens[i].hide()
        }
    }
    show()
    {
        for (var i = 0; i < this.itens.length; i++)
        {
            this.itens[i].show()
        }
    }
    updateItems()
    {
        for (var i = 0; i < this.itens.length; i++)
        {
            this.itens[i].updateData()
        }
    }
    update(delta)
    {


    }
    updateAllItens()
    {
        for (var i = 0; i < this.catsItemList.length; i++)
        {
            this.catsItemList[i].updateItem(GAME_DATA.catsData[i])
        }
    }

}