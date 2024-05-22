# Use the .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG TARGETARCH
WORKDIR /source

# Copy the solution file
COPY *.sln .

# Copy the project file and restore dependencies
COPY *.csproj ./
WORKDIR /source
RUN dotnet restore

# Copy all the project files
COPY . .


# Publish the application
RUN dotnet publish --os linux --arch "${TARGETARCH}" -c release -o /app

# Use the ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./

RUN apt-get update && apt-get install -y curl

ENTRYPOINT ["dotnet", "BeveragePaymentApi.dll"]