#!/bin/bash


export OPENSSL_CONF=openssl.cnf
export ECNAME=secp256r1


read -p "Enter your name:" STUDENT_NAME
#read -p "Enter your email address:" STUDENT_EMAIL

cat >openssl.cnf <<'EOF'
# OpenSSL Configuration

CA_HOME = .
#RANDFILE = $ENV::CA_HOME/private/.rnd


# The 'ca' section defines where to find all of the configuration for a specific certificate authority

# By default, use the intermediate CA
# We do not want to be signing certificates with the Root CA by accident!
# Changed with the -name argument
[ ca ]
default_ca = intermediate_ca

[ root_ca ]
dir           = $ENV::CA_HOME/Root
certs         = $dir/certs
serial        = $dir/serial
database      = $dir/index
new_certs_dir = $dir/newcerts
certificate   = $dir/cacert.pem
private_key   = $dir/private/ca.key.pem
default_days  = 730 # 2 years

# CRL Info
crl           = $dir/crl/root.crl
crl_dir       = $dir/crl
crlnumber     = $dir/crlnum
default_crl_days = 30
crl_extensions  = crl_ext

name_opt      = multiline, align
cert_opt      = no_pubkey
copy_extensions = copy

default_md    = sha256
preseve       = no
email_in_dn   = no
policy        = standard_policy
unique_subject = no

#Intermediate CA Configuration
[ intermediate_ca ]
dir           = $ENV::CA_HOME/Intermediate
certs         = $dir/certs
serial        = $dir/serial
database      = $dir/index
new_certs_dir = $dir/newcerts
certificate   = $dir/cacert.pem
private_key   = $dir/private/ca.key.pem
default_days  = 730 # 2 years

# CRL Info
crl           = $dir/crl/intermediate.crl
crl_dir       = $dir/crl
crlnumber     = $dir/crlnum
default_crl_days = 30
crl_extensions  = crl_ext

name_opt      = multiline, align
cert_opt      = no_pubkey
copy_extensions = copy

default_md    = sha256
preseve       = no
email_in_dn   = yes
policy        = standard_policy
unique_subject = no



# Policies tell the CA how to behave when signing. These are a sort of automatic sanity check
# optional says the value may exist, but does not have to
# supplied says the request must supply a value, but it is not otherwise validated automatically
# match says that the value must match the same value in the certificate authority



# A fairly open policy; only requires a Common Name
[ standard_policy ]
countryName           = optional
stateOrProvinceName   = optional
localityName          = optional
organizationName      = optional
organizationalUnitName  = optional
commonName            = supplied
emailAddress          = optional

# A strict policy that requires the Country Name, Locality Name, Common Name, and Email Address, 
# BUT requires that the organizational name is the same as the CA Organizational Name
[ strict_policy ] 
countryName           = supplied
stateOrProvinceName   = supplied
localityName          = supplied
organizationName      = match
organizationalUnitName  = optional
commonName            = supplied
emailAddress          = supplied

[ user_policy ] 
countryName           = optional
stateOrProvinceName   = optional
localityName          = optional
organizationName      = optional
organizationalUnitName  = optional
commonName            = supplied
emailAddress          = supplied


# When making a CRL, include these extensions
[ crl_ext ]
authorityKeyIdentifier  = keyid:always
issuerAltName           = issuer:copy


# 'req' is the configuration for the req sub command

[ req ]
default_bits        = 3072
encrypt_key         = yes
default_md          = sha256
string_mask         = utf8only
utf8                = yes
prompt              = yes
req_extensions      = req_ext
distinguished_name  = req_distinguished_name

# Extensions when making a request
#
[ req_ext ]
subjectKeyIdentifier    = hash
#subjectAltName = @san_attributes


# These are the policies for asking for a Distinguished Name
# You can set these however you want, and may also include other attributes
[ req_distinguished_name ]
countryName                     = Country Name (2 letter code)
countryName_min                 = 2
countryName_max                 = 2
stateOrProvinceName             = State or Province Name (full name)
localityName                    = Locality Name (eg, city)
0.organizationName              = Organization Name (eg, company)
organizationalUnitName          = Organizational Unit Name (eg, section)
commonName                      = Common Name (eg, YOUR name)
commonName_max                  = 64
emailAddress                    = Email Address
emailAddress_max                = 64


# These define the various CRL and OCSP distribution points
[ root_ocsp_info ] 
caIssuers;URI       = http://ca.lan/certs/root.pem
OCSP;URI.0          = http://root-ocsp.ca.lan:9000/

[ root_crl_dist ]
fullname            = URI:http://ca.lan/crl/root.crl

[ intermediate_ocsp_info ]
caIssuers;URI       = http://ca.lan/certs/intermediate.pem
OCSP;URI.0          = http://intermediate-ocsp.ca.lan:9001/

[ intermediate_crl_dist ]
fullname            = URI:http://ca.lan/crl/intermediate.crl


# These define various extensions used in different certificate types
#
#
#
# These will be self-signed certificates, and generally do not have OCSP/CRL info
[ root-ca_ext ]
basicConstraints        = critical, CA:true, pathlen:1
keyUsage                = critical, keyCertSign, cRLSign
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always
#issuerAltName           = issuer:copy

# These will be signed by the root certificate authority
[ intermediate-ca_ext ]
basicConstraints        = critical, CA:true, pathlen:0
keyUsage                = critical, keyCertSign, cRLSign
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always
#issuerAltName           = issuer:copy
authorityInfoAccess     = @root_ocsp_info
crlDistributionPoints   = root_crl_dist

# OCSP Server has special requirements
[ ocsp_ext ]
basicConstraints        = critical, CA:false
keyUsage                = critical, digitalSignature
extendedKeyUsage        = critical, OCSPSigning
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always
#issuerAltName           = issuer:copy


# The following are only signed by the intermediate
[ server_ext ]
basicConstraints        = critical, CA:false
keyUsage                = critical, digitalSignature, keyEncipherment
extendedKeyUsage        = critical, serverAuth
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always
#issuerAltName           = issuer:copy
authorityInfoAccess     = @intermediate_ocsp_info
crlDistributionPoints   = intermediate_crl_dist

[ client_ext ]
basicConstraints        = critical, CA:false
keyUsage                = critical, digitalSignature
extendedKeyUsage        = critical, clientAuth
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always
#issuerAltName           = issuer:copy
authorityInfoAccess     = @intermediate_ocsp_info
crlDistributionPoints   = intermediate_crl_dist

[ user_ext ] 
basicConstraints        = critical, CA:false
keyUsage                = critical, digitalSignature, keyEncipherment
extendedKeyUsage        = critical, clientAuth, emailProtection
subjectKeyIdentifier    = hash
authorityKeyIdentifier  = keyid:always
#issuerAltName           = issuer:copy
authorityInfoAccess     = @intermediate_ocsp_info
crlDistributionPoints   = intermediate_crl_dist

EOF

# Setup Root
mkdir -p Root/{reqs,certs,crl,newcerts,private}
chmod 700 Root/private
touch Root/index
echo 00 >Root/crlnum
openssl rand -hex 16 >Root/serial

# Setup Intermediate
mkdir -p Intermediate/{reqs,certs,crl,newcerts,private}
chmod 700 Intermediate/private
touch Intermediate/index
echo 00 > Intermediate/crlnum
openssl rand -hex 16 > Intermediate/serial


# Create Root
# New Certificate Request
openssl req -new -out Root/req.pem -newkey ec:<(openssl ecparam -name "$ECNAME") -keyout Root/private/ca.key.pem -nodes -subj "/O=${STUDENT_NAME}/CN=${STUDENT_NAME} Root Authority"

# Sign the root CA for 20 years
openssl ca -name root_ca -selfsign -in Root/req.pem -out Root/cacert.pem -extensions root-ca_ext -days $(( 365 * 20 )) -batch

# Generate a new serial number!
openssl rand -hex 16 >Root/serial

# Root CRL requires the root_ca name
openssl ca -name root_ca -gencrl -out Root/crl/root.crl



# Create the Intermediate Authority
# New Certificate Request
openssl req -new -out Intermediate/req.pem -newkey ec:<(openssl ecparam -name "$ECNAME") -keyout Intermediate/private/ca.key.pem -nodes -subj "/O=${STUDENT_NAME}/CN=${STUDENT_NAME} Intermediate Authority"

# Sign the intermediate authority using the Root CA for 5 years
openssl ca -name root_ca -in Intermediate/req.pem -out Intermediate/cacert.pem -extensions intermediate-ca_ext -days $(( 365 * 5 )) -batch

# Generate a new serial number!
openssl rand -hex 16 >Root/serial

# Intermediate CA is the default CA
openssl ca -gencrl -out Intermediate/crl/intermediate.crl



# Issue Certificates for OCSP Responders
mkdir OCSP

# Root
openssl req -new -newkey ec:<(openssl ecparam -name "$ECNAME") -keyout OCSP/root.key -out OCSP/root.csr -nodes -subj "/O=${STUDENT_NAME}/CN=root-ocsp.ca.lan"

# Sign the certificate to make OCSP Requests
openssl ca -name root_ca -in OCSP/root.csr -out OCSP/root.pem -extensions ocsp_ext -batch

# Always remember to generate a new Serial!
openssl rand -hex 16 >Root/serial

# Intermediate
openssl req -new -newkey ec:<(openssl ecparam -name "$ECNAME") -keyout OCSP/intermediate.key -out OCSP/intermediate.csr -nodes -subj "/O=${STUDENT_NAME}/CN=intermediate-ocsp.ca.lan"

# Sign the key
openssl ca -in OCSP/intermediate.csr -out OCSP/intermediate.pem -extensions ocsp_ext -batch

# Always remember to generate a new Serial!
openssl rand -hex 16 >Intermediate/serial

# Make a directory for us to put requests in
mkdir Requests

# Package up the certificates
cat Root/cacert.pem >Requests/ca.pem
cat Intermediate/cacert.pem >Requests/chain.pem

