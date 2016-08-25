Idea for compiling a benchmarks db using AWS Lambda, Web API gateway, DynamoDB & static json in S3 Bucket
==

dynamo db table 'benchmarks'

```
category, resolution_ profile, resolution, profile, cpu, gpu, min, avg, max
```


```
select
  category, resolution_ profile, resolution, profile, cpu, gpu, avg(avg) as rank
from
  benchmarks
group by
  resolution, profile, cpu, gpu
order by
  category asc, rank desc
```

Output 5 Tabs
--

576, 720, 1080, 1440, 2160
--

4 Headings on each tabbed content area

1080
==   

  Basic
  --
    Core i5-2500 @ 3.30GHz, GeForce GTX 660 Ti/PCIe/SSE2, 44

  Medium
  --

  High
  --
    Core 2 Duo @ 3.0GHz, GeForce GTX 750 Ti/PCIe/SSE2, 58

  Ultra
  --

Insert current system into the benchmark table 'live' (because the user may not want to share)
