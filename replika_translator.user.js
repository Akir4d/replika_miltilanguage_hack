// ==UserScript==
// @name         Replica Translator
// @version      0.1
// @description  try to take over the world!
// @author       Paolo Rampino
// @match        https://my.replika.ai/
// @match        https://my.replika.ai/*
// @grant    none
// ==/UserScript==

//License: MIT

//All you need is an enbled google cloud translate api 
//and api key from api from 
//https://console.developers.google.com/
//and destination lang on var lang = 'it' 
var myKey = "YOUR-GOOGLE-API-KEY-HERE";

//set your lang
var lang = 'it';

javascript: (function(e, s) {
    e.src = s;
    e.onload = function() {
        jQuery.noConflict();
        jQuery('body').append(`<script>
        var lang = '` + lang + `';
        function translationLoop() {
            setTimeout(
                () => {
                    checkTranslation();
                    translationLoop();
                    addButtons();
                }, 100
            )
        }
        
        function checkTranslation() {
            jQuery('[id ^=message][id $=-text]').each((i, e) => {
                if (!jQuery(e).hasClass('trans')) {
                    let tid = "Translated-" + jQuery(e).attr('id');
                    let term = btoa(encodeURIComponent(jQuery(e).text()));
                    try {
                        jQuery(e).html(
                            jQuery(e).html() + '<br><span id="' + tid + '"><button onclick="'+\`getTranslation('\` + tid + \`', '\` + term + \`', '\` + lang + \`')" \` + '>T</button></span>');
                        jQuery(e).addClass('trans');
                    } catch {}
                }
            });
        }
        
        function translationLoop() {
            setTimeout(
                () => {
                    checkTranslation();
                    translationLoop();
                    addButtons();
                }, 100
            )
        }
        
        function getTranslation(tid, term, target, useVal = false) {
            var url = "https://translation.googleapis.com/language/translate/v2";
            url += "?q=" + atob(term);
            url += "&q=" + encodeURIComponent(tid);
            url += "&target=" + target;
            url += "&key=` + myKey + `";
            jQuery.get(url, function(data, status) {
                if (useVal) {
                    jQuery('#' + tid).val(data.data.translations[0].translatedText);
                } else {
                    jQuery('#' + tid).html('<hr>' + data.data.translations[0].translatedText);
                }
            });
        };
        // this caches your Input
        var allIsaid = '';
        
        function addButtons() {
            if (!jQuery('#toTranslate').length) {
                jQuery('[data-testid=chat-controls-emoji-keyboard-button]').parent().prepend('<button id="toTranslate" style="display:inline" onclick="translateTo()">T</button><button id="fromTranslate" style="display:none" onclick="translateFrom()" >U</button>');
                jQuery('[id=send-message-textarea]').on('keyup', () => {
                    unTrans();
                });
            }
        }
        
        function translateTo() {
            allIsaid = jQuery('[id=send-message-textarea]').val();
            jQuery('#toTranslate').attr('style', 'display: none');
            jQuery('#fromTranslate').attr('style', 'display: inline');
            getTranslation("send-message-textarea", btoa(encodeURIComponent(allIsaid)), 'en', true)
        }
        
        function unTrans() {
            jQuery('#fromTranslate').attr('style', 'display: none');
            jQuery('#toTranslate').attr('style', 'display: inline');
        }
        
        function translateFrom() {
            jQuery('#fromTranslate').attr('style', 'display: none');
            jQuery('#toTranslate').attr('style', 'display: inline');
            jQuery('[id=send-message-textarea]').val(allIsaid.replace(/[\u00A0-\u9999<>\&]/gim, function(i) { return '&#'+i.charCodeAt(0)+';';}));
        }
        </script>
        `);

        translationLoop();
        addButtons();
    };
    document.head.appendChild(e);
})(document.createElement('script'), '//code.jquery.com/jquery-latest.min.js');
