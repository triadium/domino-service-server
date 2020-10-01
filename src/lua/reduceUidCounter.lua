--[[
key 1 -> wqs:uid:qindex (hset)
key 2 -> wqs:uid:count (hset)
arg 1 -> uid
]]

local uidCount = tonumber(redis.call('HINCRBY', KEYS[2], ARGV[1], -1))

if uidCount <= 0 then
  redis.call('HDEL', KEYS[1], ARGV[1])
  redis.call('HDEL', KEYS[2], ARGV[1])
end

return uidCount >= 0 and 1 or 0
