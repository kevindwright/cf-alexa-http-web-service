<cfcomponent name="occupancyGateway"  output="false" access="remote" hint="Defines Gateway functions for Occupancy Data" >

<!--- ############################################################## 

INIT

################################################################ --->

   <cffunction name="init" access="public" output="false" returntype="occupancyGateway" hint="constructor">
     	<cfset response = #getPageContext().getResponse()# />
		<cfset response.setContentType = "application/json" />
      <cfreturn this />
   </cffunction>


<!--- ############################################################## 

getSummary

################################################################ --->

   	<cffunction name="getSummary" access="remote" output="false" returntype="string" returnformat="json">
		<cfargument name="property" required="yes" default="">
     	<cfargument name="requestDate" required="yes" default="">
     	
			<cfstoredproc procedure="getSummary" datasource="#GetApplicationMetaData().DSN#" result="qSummarySP">
				<cfprocparam cfsqltype="CF_SQL_INTEGER" dbvarname="propertyID" value="#ARGUMENTS.property#" />
				<cfprocparam cfsqltype="CF_SQL_DATE" dbvarname="dtDate" value="#ARGUMENTS.requestDate#" />
				<cfprocresult name="qSummary">
			</cfstoredproc>

			<cfset qData = Serializejson(qSummary,true)>
			
		<cfreturn #qData# />

   	</cffunction>
    
  
<!--- ############################################################## 

getOccupancy

################################################################ --->

   	<cffunction name="getOccupancy" access="remote" output="false" returntype="string" returnformat="json">
        <cfargument name="property" required="yes" default="">
     	<cfargument name="requestDate" required="yes" default="">
                 
       <cfstoredproc procedure="getOccupancy" datasource="#GetApplicationMetaData().DSN#" result="qOccupancySP">
            <cfprocparam cfsqltype="CF_SQL_INTEGER" dbvarname="propertyID" value="#ARGUMENTS.property#" />
            <cfprocparam cfsqltype="CF_SQL_DATE" dbvarname="dtDate" value="#ARGUMENTS.requestDate#" />
            <cfprocresult name="qOccupancy">
        </cfstoredproc>

        <cfset qData = Serializejson(qOccupancy,true)>
		<cfreturn #qData# />

   	</cffunction> 
   	
<!--- ############################################################## 

getLocation

################################################################ --->

   	<cffunction name="getLocation" access="remote" output="false" returntype="string" returnformat="json">
       <cfargument name="property" required="yes" default="">

       <cfstoredproc procedure="getLocation" datasource="#GetApplicationMetaData().DSN#" result="qLocationSP">
            <cfprocparam cfsqltype="CF_SQL_INTEGER" dbvarname="propertyID" value="#ARGUMENTS.property#" />
            <cfprocresult name="qLocation">
        </cfstoredproc>

        <cfset qData = Serializejson(qLocation,true)>
		<cfreturn #qData# />

   	</cffunction>

    
</cfcomponent>