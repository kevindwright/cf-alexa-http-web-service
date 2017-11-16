<cfheader 
    name="Content-Type" 
    value="application/json">


<cfif IsDefined("URL.weekEnding")>
	<cfif NOT isDate(#URL.weekEnding#)>
		<cfset URL.weekEnding = Now() />
	</cfif>
	<cfset dtLastWeek = (Fix(#URL.weekEnding#) - 7) />
	<cfset dtWeekStart = DateFormat(dtLastWeek - DayOfWeek( dtLastWeek ) + 1) />
	<cfset dtWeekEnding = DateFormat( dtWeekStart + 6 ) />
</cfif>

<cfswitch expression="#URL.method#">

	<cfcase value="getSummary">     
		<cfinvoke component="cfc.OccupancyGateway" method="getSummary" returnvariable="returnData" >
			<cfinvokeargument name="property" value="#URL.property#"/>
			<cfinvokeargument name="requestDate" value="#dtWeekEnding#"/>
		</cfinvoke>
	</cfcase>
	
	<cfcase value="getOccupancy">     
		<cfinvoke component="cfc.OccupancyGateway" method="getOccupancy" returnvariable="returnData" >
			<cfinvokeargument name="property" value="#URL.property#"/>
			<cfinvokeargument name="requestDate" value="#dtWeekEnding#"/>
		</cfinvoke>
	</cfcase>
	
	<cfcase value="getLocation">     
		<cfinvoke component="cfc.OccupancyGateway" method="getLocation" returnvariable="returnData" >
			<cfinvokeargument name="property" value="#URL.property#"/>
		</cfinvoke>  
	</cfcase>

</cfswitch>


<cfoutput>#returnData#</cfoutput>


