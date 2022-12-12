

class LocalStorage
{
    constructor(bundleId){
        this.id = bundleId || 'com.goodboydigital';

        this.canSave = false;

        try
    {
            localStorage.setItem(this.id + '.access', true);
            localStorage.removeItem(this.id + '.access', true);

            this.canSave = true;
        }
        catch(e)
        {
          // 

        }
    }

  // store string values..
    store(key, value)
  {
        if(!this.canSave)return;
        localStorage.setItem(this.id + '.' + key, value);
    }

  // retrieve string values
    get(key)
  {
        if(!this.canSave)return;

        return localStorage.getItem(this.id + '.' + key);
    }

    storeObject(key, value)
  {
        if(!this.canSave)return;
        localStorage.setItem(this.id + '.' + key, JSON.stringify( value ));
    }

    getObject(key)
  {
        if(!this.canSave)return;

        return JSON.parse(localStorage.getItem(this.id + '.' + key));
    }

    remove(key)
  {
        if(!this.canSave)return;

        localStorage.removeItem(this.id + '.' + key);
    }

    reset()
  {
        if(!this.canSave)return;

        for(var i in localStorage)
      {
            if(i.indexOf(this.id + '.') !== -1) localStorage.removeItem(i);
        }
    }

}


export default LocalStorage;
