'use client';

import Script from 'next/script';

export default function SmartSuppProvider() {
    return <Script
        defer
        id="show-livechat"
        type="text/javascript"
        dangerouslySetInnerHTML={{
            __html: `var _smartsupp = _smartsupp || {};
        _smartsupp.key = 'c90bf9babec13c6010995379425cfea26f555b32';
        window.smartsupp || (function (d) {
            var s, c, o = smartsupp = function () { o._.push(arguments) }; o._ = [];
            s = d.getElementsByTagName('script')[0]; c = d.createElement('script');
            c.type = 'text/javascript'; c.charset = 'utf-8'; c.async = true;
            c.src = 'https://www.smartsuppchat.com/loader.js?'; s.parentNode.insertBefore(c, s);
        })(document)` }}
        onLoad={() => {
            console.log('Script has loaded')
        }}
    />
}
