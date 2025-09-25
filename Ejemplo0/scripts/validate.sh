#!/bin/bash
# @autor: fjfh06
# @comment:
# @description: Script que valida si tenemos instalados git, node, npm, curl
# crear un script que utilizando el comando command -v verifique si tengo instalado o no los paquetes git, node, npm, curl. Si alguno no esta en el sistema mostraremos mensaje de error 

clear

echo -e "Verificando requisitos previos\n\n"


if command -v git > /dev/null 2>&1 ; then
	GIT_VERSION=$(git --version)
	echo -e "git instalado correctamente; Version: $GIT_VERSION\n"
else
	echo -e "no instalado git\n"
	exit 1
fi


if command -v node > /dev/null 2>&1 ; then
	NODE_VERSION=$(node --version)
        echo -e "node instalado correctamente; Version: $NODE_VERSION\n"
else
        echo -e "no instalado node\n"
	exit 1
fi


if command -v npm > /dev/null 2>&1 ; then
	NPM_VERSION=$(npm --version)
        echo -e "npm instalado correctamente; Version: $NPM_VERSION\n"
else
        echo -e "no instalado npm\n"
	exit 1
fi

if command -v curl > /dev/null 2>&1 ; then
	CURL_VERSION=$(curl --version)
        echo -e "curl instalado correctamente\n"
else
        echo -e "no instalado curl\n"
	exit 1
fi

echo "----Todos los paquetes instalados correctamente"
