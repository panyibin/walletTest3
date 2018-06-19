//
//  NSDictionary+Yibin.h
//  Pods-YBUtils_Example
//
//  Created by PanYibin on 2018/3/11.
//

#import <Foundation/Foundation.h>

@interface NSDictionary (Yibin)

- (BOOL)getBoolForKey:(NSString*)key;
- (NSInteger)getIntegerForKey:(NSString*)key;
- (float)getFloatForKey:(NSString*)key;
- (NSString*)getStringForKey:(NSString*)key;
- (NSArray*)getArrayForKey:(NSString*)key;
- (NSDictionary*)getDictionaryForKey:(NSString*)key;

@end
