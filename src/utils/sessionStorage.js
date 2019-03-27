define(function(){
    if('sessionStorage' in window) return;
    function Storage(){
        this.box = document.body || document.getElementByTagName('head')[0] || document.documentElement;
        this.name = 'sessionStorage'
        this.data = document.createElement(this.name);
        this.data.addBehavior("#default#userData");
        this.box.appendChild(this.data);
        this.map = [];
        this.length = this.length();
    }
    Storage.prototype.setItem = function(name,val){
        if(name=='sessionStorage-map'){
            throw new Error("this is sessionStorage in key [sessionStorage-map] not use!")
            return ;
        }
        if(this.map.length==0){
            this.data.load('sessionStorage-map');
            var data = this.data.getAttribute('sessionStorage-map');
            if(data!=null){
                this.map = data.split(',');
            }
        }
        var flag = true;
        for(var i in this.map){
            if(this.map[i] == name){
                flag = false;
            }
        }
        if(flag){
            this.map.push(name)
        }
        this.data.setAttribute(name,val);
        var date = new Date();
        date.setDate(date.getDate()+700);
        this.data.expires = date.toUTCString();
        this.data.save(name);
        this.data.setAttribute('sessionStorage-map',this.map);
        this.data.save('sessionStorage-map');
    }
    Storage.prototype.getItem = function(name){
        if(name == 'sessionStorage-map'){
            throw new Error("this is sessionStorage in key [sessionStorage-map] not use!");
            return;
        }
        this.data.load(name);
        return this.data.getAttribute(name);
    };
    Storage.prototype.length = function(){
        if(this.map.length==0){
            this.data.load('sessionStorage-map');
            var data = this.data.getAttribute('sessionStorage-map');
            if(data!=null){
                this.map = data.split(',');
            }
        }
        for (var i = this.map.length - 1; i >= 0; i--) {
            alert(this.getItem(this.map[i]))
            if(this.getItem(this.map[i])==undefined || this.getItem(this.map[i])==""){
                this.map.splice(i,1);
            }
        }
        return this.map.length;
    };
    Storage.prototype.removeItem = function(name){
        if(typeof name=="undefined" || name=="") return;
        if(this.map.length==0){
            if(this.getItem('sessionStorage-map')!=null){
                this.map = this.getItem('sessionStorage-map').split(',');
            }
        }
        for(var i in this.map){
            if(this.map[i] == name){
                this.map.splice(i,1);
            }
        }
        this.data.load(name);
        this.data.setAttribute(name,undefined);
        this.data.save(name);
        return true;
    },
        Storage.prototype.clear=function(){
            if(this.map.length==0){
                if(this.getItem('sessionStorage-map')!=null){
                    this.map = this.getItem('sessionStorage-map').split(',');
                }
            }
            for(var i in this.map){
                this.removeItem(this.map[i]);
            }
        }
    window.sessionStorage = new Storage();
});
