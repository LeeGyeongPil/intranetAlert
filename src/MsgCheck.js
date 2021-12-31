const request = require("request");
const iconv = require('iconv-lite')
const charset = require('charset')
const HTMLParser = require('node-html-parser');
const Notify = require('./Notify');

class MsgCheck
{
    constructor() {
        this.lastCall = 0;
        this.ck = 'PHPSESSID=qrpibff5h70il79c7mnmormt90;';
    }

    crawing(url, cbfunc) {
        request({
            url: url,
            encoding: null,
            headers: {
                Cookie: this.ck
            }
        }, (error, response, body) => {
            cbfunc(error, response, body);
        });
    }

    parser() {
        this.crawing('{{list_url}}', (error, response, body) => {
            var html = HTMLParser.parse(body);
            var check = html.querySelectorAll('table.noteList')
            if (check.length) {
                const enc = charset(response.headers, body)
                var html = HTMLParser.parse(iconv.decode(body, enc));
                var list = html.querySelectorAll('table.noteList tr');
                if (list.length) {
                    var lists = [];
                    for (var x in list) {
                        var hhh = HTMLParser.parse(list[x].toString())
        
                        var no = hhh.querySelector('input[name=orderParam]').getAttribute('value');
                        if (this.lastCall < no) {
                            this.lastCall = no;
                            // 쪽지 이미지파일명을 비교하여 읽은 쪽지인지 체크
                            if (hhh.querySelector('td:nth-child(2) img').getAttribute('src') == '{{icon_url}}') {
                                continue;
                            }
                            lists.push([
                                hhh.querySelector('td:nth-child(4) a').innerText,
                            ]);
                        }
                    }
                    if (lists.length) {
                        for (var y in lists) {
                            Notify.toastConfirm(lists[y][0]);
                        }
                    }
                }
            } else {
                // 세션쿠키값 변경되었으면 체크
                this.crawing('{{login_url}}', (error, response, body) => {
                    if (this.ck != response.request.originalCookieHeader) {
                        this.ck = response.request.originalCookieHeader;
                    } else {
                        // 로그아웃처리된것으로 판단
                        Notify.toastConfirm('인트라넷 로그아웃되었습니다.');
                    }
                });
            }
        });
    }
}

module.exports = new MsgCheck();