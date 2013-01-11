//1）对于单字节的符号，字节的第一位设为0，后面7位为这个符号的unicode码。因此对于英语字母，UTF-8编码和ASCII码是相同的。
//2）对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的unicode码。
function toUTF8(str){
    var strarr = [];
    for(var j=0;j<str.length;j++){
        var int = str.charCodeAt(j); //获取字符ASCII码
        var n;
        //Unicode符号范围     | UTF-8编码方式                       |十进制
        //(十六进制)          | （二进制）
        //--------------------+-------------------------------------+-------
        //0000 0000-0000 007F | 0xxxxxxx                            |127
        //0000 0080-0000 07FF | 110xxxxx 10xxxxxx                   |2047
        //0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx          |65535
        //0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |1114111
        if(int<127){
            n = 1;
        }else if(int<2047){
            n = 2;
        }else if(int<65535){
            n = 3;
        }else if(int<1114111){
            n = 4;
        }
        var bytearr = [];
        var int2 = int.toString(2)
        if(n==1){ //单字节时直接把首位为0，后面加入该字符的ASCII码
            bytearr[0] = [];
            bytearr[0][0] = 0;
            bytearr[0].push(int2);
        }else{
            for(var i=0;i<n;i++){
                bytearr.push([]); //如果不是单字节，每个字节设置为一个数组方便后面操作
            }
            //(a操作)对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。
            for(var i=0;i<n;i++){
                bytearr[0][i] = 1;
                bytearr[i][0] = 1;
                bytearr[i][1] = 0;
            }
            bytearr[0][n] = 0;
            var int2len = int2.length;
            //剩下的没有提及的二进制位，全部为这个符号的unicode码。
            for(var i=n-1;i>=0;i--){
                bytearr[i].push(int2.substring(int2len-6*(n-i),int2len-6*(n-i-1)));
            }
            //首字节若不满8位，则在a操作后面补充若干0
            var fitstBytelen = bytearr[0].join('').length;
            if(fitstBytelen!=8){
                for(var i=0;i<8-fitstBytelen;i++){
                    bytearr[0][n+1] = '0'+bytearr[0][n+1];
                }
            }
        }
        //每个字节转换成16进制
        for(var i=0;i<n;i++){
            bytearr[i] = bytearr[i].join('');
            bytearr[i] = parseInt(bytearr[i],2).toString(16);
        }
        //数组颠倒一下，在最后添加一个空字符串，再颠倒回来，通过join方法可以在首位也加上"%"号
        //或者直接 return '%'+bytearr.join('%');
        bytearr.reverse();
        bytearr.push('');
        bytearr.reverse();
        strarr.push(bytearr.join('%').toUpperCase());
    }
    return strarr.join('');
}


function toUnicode(str){
    var a = [];
    for(var i=0;i<str.length;i++){
        var int = str.charCodeAt(i)
        a.push(int.toString(16));
    }
    return '\\u'+a.join('\\u')
}

function unicodeToString(str){
    var arr = str.split('\\u');
    arr.shift();
    var _str = '';
    for(var i=0;i<arr.length;i++){
        arr[i] = parseInt(arr[i],16);
        _str += String.fromCharCode(arr[i])
    }
    return _str;
}
