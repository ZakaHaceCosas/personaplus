--[[ <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/assets/fonts/FontParser.lua
 * Basically: A Lua script to convert all those font files onto a JSON
 *
 * <=============================================================================>
]]

local directory = "./"  -- current dir
local output_file_path = "ParsedFonts.txt"  -- output here

local file_dict = {}

local p = io.popen('dir "' .. directory .. '" /b')  -- use window's dir script
if p then
    for filename in p:lines() do
        local name, ext = filename:match("(.+)%.(.+)")
        if name then
            file_dict[name] = filename
        end
    end
    p:close()
end

local output_file = io.open(output_file_path, "w")
if output_file then
    for name, full_filename in pairs(file_dict) do
        output_file:write("\"" .. name .. "\"" .. ': require("../assets/fonts/' .. full_filename .. '"),\n') -- writes the file
    end
    output_file:close()
end

-- NOTE: it will write everything, INCLUDING the OFL files, FontParser.lua, etc...
-- copy-paste without caution will lead to errors!
