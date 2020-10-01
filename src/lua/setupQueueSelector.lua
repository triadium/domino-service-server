--[[
key 1 -> wqs:qindex (value)
key 2 -> wqs:qlimit (value)
arg 1 -> start qindex
arg 2 -> qlimit
]]

local qindex = tonumber(ARGV[1])
local qlimit = tonumber(ARGV[2])

qindex = qindex % qlimit

redis.call('SET', KEYS[1], qindex)
redis.call('SET', KEYS[2], qlimit)
