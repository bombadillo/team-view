// Mock file contents as an array of { path, content } entries.
// Mock file contents as a string array (each item is the file content).
export const mockRepositoryFileContents: string[] = [
  `<?xml version="1.0" encoding="utf-8"?>
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <RootNamespace>Example.Project.AppHost</RootNamespace>
    <AssemblyName>Example.Project.AppHost</AssemblyName>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Hosting.AppHost" Version="1.0.0" />
    <PackageReference Include="Aspire.Hosting.RabbitMQ" Version="1.0.0" />
    <PackageReference Include="Aspire.Hosting.SqlServer" Version="1.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\src\\InboxWorker\\InboxWorker.csproj" />
    <ProjectReference Include="..\\src\\MessageHandlerWorker\\MessageHandlerWorker.csproj" />
    <ProjectReference Include="..\\src\\Migrator\\Migrator.csproj" />
    <ProjectReference Include="..\\src\\OutboxWorker\\OutboxWorker.csproj" />
  </ItemGroup>
</Project>`,

  `<?xml version="1.0" encoding="utf-8"?>
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <AssemblyName>Service.V9</AssemblyName>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.1" />
  </ItemGroup>
</Project>`,

  `<?xml version="1.0" encoding="utf-8"?>
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <GeneratePackageOnBuild>true</GeneratePackageOnBuild>
    <AssemblyName>Library.V10</AssemblyName>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
  </ItemGroup>
</Project>`,

  `<?xml version="1.0" encoding="utf-8"?>
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="xunit" Version="2.4.1" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.5.0" />
  </ItemGroup>
</Project>`,
];

export default mockRepositoryFileContents;

export function getRandomRepositoryFileContent(): string {
  if (!mockRepositoryFileContents.length) return '';
  const idx = Math.floor(Math.random() * mockRepositoryFileContents.length);
  return mockRepositoryFileContents[idx];
}

export function getRandomCsprojFileContent(): string | null {
  const csprojEntries = mockRepositoryFileContents.filter(c => {
    const n = c.toLowerCase();
    return n.includes('<project') && (n.includes('.csproj') || n.includes('targetframework'));
  });
  if (!csprojEntries.length) return null;
  const idx = Math.floor(Math.random() * csprojEntries.length);
  return csprojEntries[idx];
}

