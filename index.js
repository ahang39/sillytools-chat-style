/**
 * 绿叶菜小工具-聊天样式
 * 自定义聊天字体大小、行高、段落间距
 */

import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const extensionName = "sillytools-chat-style";

const defaultSettings = {
    chatFontSize: 0
};

// ============================================================
// Settings
// ============================================================

async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }
}

function getSettings() {
    return extension_settings[extensionName] || defaultSettings;
}

// ============================================================
// Font Size
// ============================================================

function applyChatFontSize(size) {
    let styleEl = document.getElementById('lyc-chat-style-fontsize');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'lyc-chat-style-fontsize';
        document.head.appendChild(styleEl);
    }
    
    if (!size || size <= 0) {
        styleEl.textContent = '';
        return;
    }
    
    const lineHeight = (size * 1.6).toFixed(1);
    const paragraphSpacing = (size * 0.5).toFixed(1);
    
    styleEl.textContent = `
        #chat .mes_text {
            font-size: ${size}px !important;
            line-height: ${lineHeight}px !important;
        }
        #chat .mes_text p {
            margin-bottom: ${paragraphSpacing}px !important;
        }
    `;
}

// ============================================================
// UI
// ============================================================

function createSettingsUI() {
    const settingsHtml = `
    <div id="lyc-chat-style-settings" class="extension_container">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>聊天显示</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <div style="margin: 5px 0;">
                    <label>字体大小 (0 = 默认)</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="range" id="lyc-chat-style-fontsize-range" min="0" max="24" step="1" style="flex: 1;">
                        <input type="number" id="lyc-chat-style-fontsize-num" min="0" max="24" step="1" style="width: 50px;" class="text_pole">
                        <span>px</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    $('#extensions_settings').append(settingsHtml);
    
    const onFontSizeChange = function(value) {
        const size = parseInt(value) || 0;
        extension_settings[extensionName].chatFontSize = size;
        saveSettingsDebounced();
        applyChatFontSize(size);
        $('#lyc-chat-style-fontsize-range').val(size);
        $('#lyc-chat-style-fontsize-num').val(size);
    };
    
    $('#lyc-chat-style-fontsize-range').on('input', function() {
        onFontSizeChange($(this).val());
    });
    
    $('#lyc-chat-style-fontsize-num').on('change', function() {
        onFontSizeChange($(this).val());
    });
    
    updateSettingsUI();
}

function updateSettingsUI() {
    const settings = getSettings();
    const size = settings.chatFontSize || 0;
    $('#lyc-chat-style-fontsize-range').val(size);
    $('#lyc-chat-style-fontsize-num').val(size);
}

// ============================================================
// Initialize
// ============================================================

jQuery(async () => {
    await loadSettings();
    createSettingsUI();
    applyChatFontSize(getSettings().chatFontSize);
});
