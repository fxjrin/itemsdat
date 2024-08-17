const fs = require('fs');
const path = require('path');

const key = "PBG892FXX982ABC*";
let decoded = {};
let encoded = [];

const arrayHex = Array.from({ length: 256 }, (_, n) => n.toString(16).padStart(2, "0"));

function hex(buffer, i) {
    const buff = new Uint8Array(buffer);
    return Array.from(buff, byte => arrayHex[byte]).join(i ? "" : " ");
}

function number_decode(buffer, mempos, length) {
    return Array.from({ length: length }, (_, i) => buffer[mempos + i] << (i * 8))
        .reduce((acc, curr) => acc + curr, 0);
}

function string_decode(buffer, mempos, length, condition, id) {
    return Array.from({ length: length }, (_, i) =>
        String.fromCharCode(buffer[i + mempos] ^ (condition ? key.charCodeAt((id + i) % key.length) : 0))
    ).join('');
}

function number_encode(mempos, length, value) {
    Array.from({ length: length }, (_, i) => encoded[mempos + i] = (value >> (i * 8)) & 255);
}

function string_encode(mempos, length, value, condition, id) {
    Array.from({ length: length }).forEach((_, i) => {
        encoded[mempos + i] = condition
            ? value.charCodeAt(i) ^ key.charCodeAt((i + id) % key.length)
            : value.charCodeAt(i);
    });
}

function hexToBuffer(mempos, hex) {
    return hex.replace(/ /g, '').match(/[\dA-F]{2}/gi).map(i => encoded[mempos++] = parseInt(i, 16));
}

function encoder(data) {
    let mempos = 6;
    number_encode(0, 2, data.version)
    number_encode(2, 4, data.itemCount)

    for (let i = 0; i < data.itemCount; i++) {
        number_encode(mempos, 4, data.items[i].itemId);
        mempos += 4;
        encoded[mempos++] = data.items[i].isEditable
        encoded[mempos++] = data.items[i].category
        encoded[mempos++] = data.items[i].itemType
        encoded[mempos++] = data.items[i].soundType
        number_encode(mempos, 2, data.items[i].name.length);
        mempos += 2;
        string_encode(mempos, data.items[i].name.length, data.items[i].name, 1, data.items[i].itemId)
        mempos += data.items[i].name.length
        number_encode(mempos, 2, data.items[i].texturePath.length);
        mempos += 2;
        string_encode(mempos, data.items[i].texturePath.length, data.items[i].texturePath)
        mempos += data.items[i].texturePath.length
        number_encode(mempos, 4, data.items[i].textureHash)
        mempos += 4;
        encoded[mempos++] = data.items[i].itemKind
        number_encode(mempos, 4, data.items[i].value1)
        mempos += 4;
        encoded[mempos++] = data.items[i].textureX
        encoded[mempos++] = data.items[i].textureY
        encoded[mempos++] = data.items[i].spreadType
        encoded[mempos++] = data.items[i].isStripeyWallpaper
        encoded[mempos++] = data.items[i].collisionType
        encoded[mempos++] = Number(data.items[i].breakHits) * 6
        number_encode(mempos, 4, data.items[i].dropChance)
        mempos += 4;
        encoded[mempos++] = data.items[i].clothingType
        number_encode(mempos, 2, data.items[i].rarity)
        mempos += 2;
        encoded[mempos++] = data.items[i].maxAmount
        number_encode(mempos, 2, data.items[i].extraFile.length);
        mempos += 2;
        string_encode(mempos, data.items[i].extraFile.length, data.items[i].extraFile)
        mempos += data.items[i].extraFile.length
        number_encode(mempos, 4, data.items[i].extraFileHash)
        mempos += 4;
        number_encode(mempos, 4, data.items[i].audioVolume)
        mempos += 4;
        number_encode(mempos, 2, data.items[i].petName.length);
        mempos += 2;
        string_encode(mempos, data.items[i].petName.length, data.items[i].petName)
        mempos += data.items[i].petName.length
        number_encode(mempos, 2, data.items[i].petPrefix.length);
        mempos += 2;
        string_encode(mempos, data.items[i].petPrefix.length, data.items[i].petPrefix)
        mempos += data.items[i].petPrefix.length
        number_encode(mempos, 2, data.items[i].petSuffix.length);
        mempos += 2;
        string_encode(mempos, data.items[i].petSuffix.length, data.items[i].petSuffix)
        mempos += data.items[i].petSuffix.length
        number_encode(mempos, 2, data.items[i].petAbility.length);
        mempos += 2;
        string_encode(mempos, data.items[i].petAbility.length, data.items[i].petAbility)
        mempos += data.items[i].petAbility.length
        encoded[mempos++] = data.items[i].seedBase
        encoded[mempos++] = data.items[i].seedOverlay
        encoded[mempos++] = data.items[i].treeBase
        encoded[mempos++] = data.items[i].treeLeaves
        encoded[mempos++] = data.items[i].seedColor.alpha
        encoded[mempos++] = data.items[i].seedColor.red
        encoded[mempos++] = data.items[i].seedColor.green
        encoded[mempos++] = data.items[i].seedColor.blue
        encoded[mempos++] = data.items[i].seedOverlayColor.alpha
        encoded[mempos++] = data.items[i].seedOverlayColor.red
        encoded[mempos++] = data.items[i].seedOverlayColor.green
        encoded[mempos++] = data.items[i].seedOverlayColor.blue
        number_encode(mempos, 4, data.items[i].ingredients);
        mempos += 4;
        number_encode(mempos, 4, data.items[i].growTime);
        mempos += 4;
        number_encode(mempos, 2, data.items[i].value2);
        mempos += 2;
        number_encode(mempos, 2, data.items[i].isRayman);
        mempos += 2;
        number_encode(mempos, 2, data.items[i].extraOptions.length);
        mempos += 2;
        string_encode(mempos, data.items[i].extraOptions.length, data.items[i].extraOptions)
        mempos += data.items[i].extraOptions.length
        number_encode(mempos, 2, data.items[i].texture2.length);
        mempos += 2;
        string_encode(mempos, data.items[i].texture2.length, data.items[i].texture2)
        mempos += data.items[i].texture2.length
        number_encode(mempos, 2, data.items[i].extraOptions2.length);
        mempos += 2;
        string_encode(mempos, data.items[i].extraOptions2.length, data.items[i].extraOptions2)
        mempos += data.items[i].extraOptions2.length
        hexToBuffer(mempos, data.items[i].dataPosition)
        mempos += 80;
        if (data.version >= 11) {
            number_encode(mempos, 2, data.items[i].punchOptions.length);
            mempos += 2;
            string_encode(mempos, data.items[i].punchOptions.length, data.items[i].punchOptions)
            mempos += data.items[i].punchOptions.length
        }
        if (data.version >= 12) {
            hexToBuffer(mempos, data.items[i].value3)
            mempos += 13;
        }
        if (data.version >= 13) {
            number_encode(mempos, 4, data.items[i].value3)
            mempos += 4;
        }
        if (data.version >= 14) {
            number_encode(mempos, 4, data.items[i].value4)
            mempos += 4;
        }
        if (data.version >= 15) {
            hexToBuffer(mempos, data.items[i].dataVersion15)
            mempos += 25;
            number_encode(mempos, 2, data.items[i].value5.length);
            mempos += 2;
            string_encode(mempos, data.items[i].value5.length, data.items[i].value5)
            mempos += data.items[i].value5.length
        }
        if (data.version >= 16) {
            number_encode(mempos, 2, data.items[i].value6.length);
            mempos += 2;
            string_encode(mempos, data.items[i].value6.length, data.items[i].value6)
            mempos += data.items[i].value6.length
        }
        if (data.version >= 17) {
            number_encode(mempos, 4, data.items[i].value7)
            mempos += 4;
        }
        if (data.version >= 18) {
            number_encode(mempos, 4, data.items[i].value8)
            mempos += 4;
        }
    }
}

function decoder(data) {
    decoded = {};
    let mempos = 6;
    let buffer = new Uint8Array(data);
    let version = number_decode(buffer, 0, 2);
    let itemCount = number_decode(buffer, 2, 4);
    decoded.version = version;
    decoded.itemCount = itemCount;
    decoded.items = [];

    for (let i = 0; i < itemCount; i++) {
        let itemId = number_decode(buffer, mempos, 4);
        mempos += 4;
        let isEditable = buffer[mempos++];
        let category = buffer[mempos++];
        let itemType = buffer[mempos++];
        let soundType = buffer[mempos++];
        let length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let name = string_decode(buffer, mempos, length, true, Number(itemId));
        mempos += length;
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let texturePath = string_decode(buffer, mempos, length);
        mempos += length;
        let textureHash = number_decode(buffer, mempos, 4);
        mempos += 4;
        let itemKind = buffer[mempos++];
        let value1 = number_decode(buffer, mempos, 4);
        mempos += 4;
        let textureX = buffer[mempos++];
        let textureY = buffer[mempos++];
        let spreadType = buffer[mempos++];
        let isStripeyWallpaper = buffer[mempos++];
        let collisionType = buffer[mempos++];
        let breakHits = buffer[mempos++];
        breakHits = breakHits / 6;
        let dropChance = number_decode(buffer, mempos, 4);
        mempos += 4;
        let clothingType = buffer[mempos++];
        let rarity = number_decode(buffer, mempos, 2);
        mempos += 2;
        let maxAmount = buffer[mempos++];
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let extraFile = string_decode(buffer, mempos, length);
        mempos += length;
        let extraFileHash = number_decode(buffer, mempos, 4);
        mempos += 4;
        let audioVolume = number_decode(buffer, mempos, 4);
        mempos += 4;
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let petName = string_decode(buffer, mempos, length);
        mempos += length;
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let petPrefix = string_decode(buffer, mempos, length);
        mempos += length;
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let petSuffix = string_decode(buffer, mempos, length);
        mempos += length;
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let petAbility = string_decode(buffer, mempos, length);
        mempos += length;
        let seedBase = buffer[mempos++];
        let seedOverlay = buffer[mempos++];
        let treeBase = buffer[mempos++];
        let treeLeaves = buffer[mempos++];
        let color_a = buffer[mempos++];
        let color_r = buffer[mempos++];
        let color_g = buffer[mempos++];
        let color_b = buffer[mempos++];
        let overlay_color_a = buffer[mempos++];
        let overlay_color_r = buffer[mempos++];
        let overlay_color_g = buffer[mempos++];
        let overlay_color_b = buffer[mempos++];
        let ingredients = number_decode(buffer, mempos, 4)
        mempos += 4;
        let growTime = number_decode(buffer, mempos, 4);
        mempos += 4;
        let value2 = number_decode(buffer, mempos, 2);
        mempos += 2;
        let isRayman = number_decode(buffer, mempos, 2);
        mempos += 2;
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let extraOptions = string_decode(buffer, mempos, length);
        mempos += length;
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let texture2 = string_decode(buffer, mempos, length);
        mempos += length;
        length = number_decode(buffer, mempos, 2);
        mempos += 2;
        let extraOptions2 = string_decode(buffer, mempos, length);
        mempos += length;
        let dataPosition = hex(buffer.slice(mempos, mempos + 80)).toUpperCase();
        mempos += 80;
        if (version >= 11) {
            length = number_decode(buffer, mempos, 2);
            mempos += 2;
            var punchOptions = string_decode(buffer, mempos, length);
            mempos += length;
        }
        if (version >= 12) {
            var dataVersion12 = hex(buffer.slice(mempos, mempos + 13)).toUpperCase();
            mempos += 13;
        }
        if (version >= 13) {
            var value3 = number_decode(buffer, mempos, 4);
            mempos += 4;
        }
        if (version >= 14) {
            var value4 = number_decode(buffer, mempos, 4);
            mempos += 4;
        }
        if (version >= 15) {
            var dataVersion15 = hex(buffer.slice(mempos, mempos + 25)).toUpperCase();
            mempos += 25;
            length = number_decode(buffer, mempos, 2);
            mempos += 2;
            var value5 = string_decode(buffer, mempos, length);
            mempos += length;
        }
        if (version >= 16) {
            length = number_decode(buffer, mempos, 2);
            mempos += 2;
            var value6 = string_decode(buffer, mempos, length);
            mempos += length;
        }
        if (version >= 17) {
            var value7 = number_decode(buffer, mempos, 4);
            mempos += 4;
        }
        if (version >= 18) {
            var value8 = number_decode(buffer, mempos, 4);
            mempos += 4;
        }
        decoded.items[i] = {
            itemId, isEditable, category, itemType, soundType, name, texturePath,  textureHash,  itemKind,  value1,  textureX,  textureY,  spreadType, isStripeyWallpaper, collisionType, breakHits, dropChance, clothingType, rarity, maxAmount, extraFile, extraFileHash, audioVolume, petName, petPrefix, petSuffix, petAbility, seedBase, seedOverlay, treeBase, treeLeaves, seedColor: { alpha: color_a, red: color_r, green: color_g, blue: color_b }, seedOverlayColor: { alpha: overlay_color_a, red: overlay_color_r, green: overlay_color_g, blue: overlay_color_b }, ingredients, growTime, value2, isRayman, extraOptions, texture2, extraOptions2, dataPosition, punchOptions, dataVersion12, value3, value4, dataVersion15, value5, value6, value7, value8
        };
    }
}

function encode(file, output = './') {
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true });
    }
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        encoder(JSON.parse(data));
        const buffer = Buffer.from(encoded);
        fs.writeFile(path.join(output, 'items.dat'), buffer, (err) => {
            if (err) {
                console.error('Error saving file:', err);
            } else {
                console.log(`File has been saved as ${path.join(output, 'items.dat')}`);
            }
        });
    });
}

function decode(file, output = './') {
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true });
    }
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        decoder(data);
        fs.writeFile(path.join(output, 'items.json'), JSON.stringify(decoded, null, 2), (err) => {
            if (err) {
                console.error('Error saving file:', err);
            } else {
                console.log(`File has been saved as ${path.join(output, 'items.json')}`);
            }
        });
    });
}

module.exports = { decode, encode }