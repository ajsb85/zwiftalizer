# Prepare dev environment for compiling C++ node modules

# Install Python 2.7.13
# https://www.python.org/downloads/

# Install VC++ Utils and Windows SDK

# REM GO into Visual Studio 2015 and create a Visual C++ project. You will get the option to intall

# REM Common tools for Visual C++ 2015 and includes the Compiler wich is not enabled (nor downloaded) by default in the Visual Studio 2015 setup.

npm config set msvs_version 2015 --global
set GYP_MSVS_VERSION=2015
export GYP_MSVS_VERSION=2015
