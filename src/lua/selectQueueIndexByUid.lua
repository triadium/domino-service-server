--[[
key 1 -> wqs:uid:qindex (hset)
key 2 -> wqs:uid:count (hset)
key 3 -> wqs:qindex (value)
key 4 -> wqs:qlimit (value)
arg 1 -> uid
]]

local uidQindex = redis.call('HGET', KEYS[1], ARGV[1])
local uidCount = redis.call('HINCRBY', KEYS[2], ARGV[1], 1)

if uidQindex then
  return tonumber(uidQindex)
end

if tonumber(uidCount) ~= 1 then
  return nil
end

local qindex = tonumber(redis.call('GET', KEYS[3]))
local qlimit = tonumber(redis.call('GET', KEYS[4]))

qindex = (qindex + 1) % qlimit
redis.call('SET', KEYS[3], qindex)
redis.call('HSET', KEYS[1], ARGV[1], qindex)

return qindex
