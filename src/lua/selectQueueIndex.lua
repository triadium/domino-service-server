--[[
key 1 -> wqs:qindex (value)
key 2 -> wqs:qlimit (value)
]]

local qindex = tonumber(redis.call('GET', KEYS[1]))
local qlimit = tonumber(redis.call('GET', KEYS[2]))

qindex = (qindex + 1) % qlimit
redis.call('SET', KEYS[1], qindex)

return qindex
