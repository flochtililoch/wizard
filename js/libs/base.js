var $$ = new function()
{
	this.lte_ie7 = jQuery.browser.msie && jQuery.browser.version <= 7;
	this._registeredFeatures = [];
	
	this.register = function(feature)
	{
		this._registeredFeatures.push(feature)
	};
	this.run = function(idx, feature)
	{
		feature();
	};
	this.launch = function()
	{
		jQuery.each(this._registeredFeatures, this.run)
		this._registeredFeatures = [];
	};
	
	this._actions = {};
	this.action = function(id, action)
	{
		if(action === undefined)
		{
			return this._actions[id];
		}
		else
		{
			this._actions[id] = action;
		}
	};
	
	this.preloadImages = function(content, callback)
	{
		var loaded = 0;
		var images = content.find('img');
		if(!images.length)
		{
			callback();
		}
		else
		{
			images.each(function(n, elt){
				var img = new Image();
				img.src = elt.src;
				img.onload = function()
				{
					loaded++;
					if(loaded == images.length)
					{
						callback();
					}
				};
			});
		}
	};
};