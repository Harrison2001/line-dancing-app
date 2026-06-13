@echo off

echo ==========================================
echo Line Dancing Data Pipeline Started
echo %date% %time%
echo ==========================================

cd /d "C:\Users\wierc\OneDrive\Projects\Line dancing App"

python "Data Engineering/scripts/jobs/run_pipeline.py" >> "Data Engineering/logs/pipeline_daily.log" 2>&1

echo ========================================== >> "Data Engineering/logs/pipeline_daily.log"
echo Pipeline finished at %date% %time% >> "Data Engineering/logs/pipeline_daily.log"
echo ========================================== >> "Data Engineering/logs/pipeline_daily.log"
echo. >> "Data Engineering/logs/pipeline_daily.log"