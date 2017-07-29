#!/usr/bin/perl

use diagnostics;

#open input JSON file:
$filename=shift @ARGV || die "Error - need JSON file to read in!\n";
open (FILE, "<$filename") or die "Error - $!\n";

# for the 3 types of URLs to check, here are the errors messages for each that define failure
@bad_messages=("No result found", "The following term was not found in Nucleotide", "The requested URL was not found on this server");

# process each piece of data in the file as it comes
# Current line/column counter "c": i.e.,
# 	0=organism name (pagetype 0)
# 	1=genome accession (pagetype 1)
# 	4=# of VOGs (pagetype 2)
$c=0;
while($l=<FILE>)
{
	chomp($l); # strip off newline from end of string

	# valid lines that we don't need to do anything with
	if ($l eq "{" || $l eq "}" || $l eq "\t\"data\" : [" || $l eq "\t\t]," || $l eq "\t\t]" || $l eq "\t]")
	{
		next;
	}
	elsif ($l eq "\t\t[") # a new "row" of data in the webpage table
	{
		$c=0; # reset line/column counter
		next;
	}
	elsif ($l =~ /^\t\t\t/) # finally - real data!
	{
		# search-and-replace pattern matches to strip off beginning and end of line
		$l =~ s/^\t\t\t"//;
		$l =~ s/",?$//;

		if ($c==0)
		{
			my ($name, $idcode)=split /\|/, $l;
			if (!$idcode)
			{
				die "Error in file \"$filename\" - invalid format. Could not find Taxonomy code in line <$l>.\n";
			}
			testlink(0, "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=$idcode");

			# so that we do not get our IP address banned for spamming this server :-)
			sleep 1;
		}
		elsif ($c==1)
		{
			testlink(1, "https://www.ncbi.nlm.nih.gov/nuccore/$l");

			# so that we do not get our IP address banned for spamming this server :-)
			sleep 1;
		}
		elsif ($c==4)
		{
			my ($numvog, $pagename)=split /\|/, $l;
			testlink(2, "http://dmk-brain.ecn.uiowa.edu/pVOGs/genomes/$pagename.html");
		}

		# TODO: remove this later, before running for real
		# only run until the first few successful links are tested
		last if $status[0]>=10;

		# increment line/column counter
		$c++;
	}
	else
	{
		die "Error - unexpected line encountered in \"$filename\": Line=<$l>.\n";
	}
}
close FILE;

# Print table with number of cases
print "===Number of cases===\n\n";

# 3 types of status codes were reported
@status_codes=("Success: good link", "Failure: malformed URL", "Failure: invalid page");

# 3 types of errors
for (my $i=0; $i<3; $i++)
{
	print $status_codes[$i];

	my $val=$status[$i] || 0;
	print "\t".$val."\n";
}

exit(0); # exit successfully


sub testlink
# IN: pagetype, URL
# OUT: warning message for bad URLs, and increment global variable counter for the 3 types of responses
# response type 0 = Success
# response type 1 = malformed URL - SERIOUS error
# response type 2 = URL points to a page, but that page indicates that the given entry does not exist in the respective database
# the 3rd type is what we are mainly looking for - i.e., a "broken link" - although malformed URLs are even more serious
{
	my $pagetype=shift;
	my $url=shift;
	# use linux program "curl" to download the webpage at the given URL
	$content=`curl -s $url`;

	print "Testing $url...\n"; # for debugging purposes, TODO: remove later

	# test for and keep track of successes or failures
	if (! defined $content)
	{
		warn "Cannot do GET() of URL=\"$url\". It is probably malformed in some way?\n";
		# Malformed URL, status code = 1
		$status[1]++;
	}
	elsif ($content =~ /$bad_messages[$pagetype]/)
	{
		warn "*** Invalid \"$url\"***.\n";
		# Incorrect page at given URL, status code = 2
		$status[2]++;
	}
	else
	{
		# Success, status code = 0
		$status[0]++;
	}
}

